package com.justnote.just_note.service;

import com.justnote.just_note.dto.CreateNoteRequest;
import com.justnote.just_note.dto.DeleteNoteRequest;
import com.justnote.just_note.dto.FindNoteRequest;
import com.justnote.just_note.dto.NotePageResponse;
import com.justnote.just_note.dto.NoteResponse;
import com.justnote.just_note.dto.UpdateNoteRequest;
import com.justnote.just_note.entity.Note;
import com.justnote.just_note.exception.InvalidPasswordException;
import com.justnote.just_note.repository.NoteRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoteService {

	private static final int DEFAULT_SIZE = 10;
	private static final String NEWER = "newer";

	private final NoteRepository noteRepository;
	private final PasswordEncoder passwordEncoder;

	public NotePageResponse getNotePage(Long cursor, String direction, Integer size) {
		int pageSize = size == null ? DEFAULT_SIZE : size;
		if (cursor == null) {
			List<Note> notes = noteRepository.findAllByOrderByIdDesc(PageRequest.of(0, pageSize));
			boolean hasOlder = noteRepository.count() > pageSize;
			return new NotePageResponse(toResponses(notes), hasOlder, false);
		}
		if (NEWER.equals(direction)) {
			return newerPage(cursor, pageSize);
		}
		return olderPage(cursor, pageSize);
	}

	@Transactional
	public NoteResponse createNote(CreateNoteRequest request) {
		Note note = noteRepository.save(new Note(
			request.author(),
			passwordEncoder.encode(request.password()),
			request.title(),
			request.content()
		));
		return NoteMapper.toResponse(note);
	}

	public List<NoteResponse> findNotes(FindNoteRequest request) {
		return noteRepository.findByAuthor(request.author()).stream()
			.filter(note -> passwordEncoder.matches(request.password(), note.getPassword()))
			.map(NoteMapper::toResponse)
			.toList();
	}

	@Transactional
	public NoteResponse updateNote(Long id, UpdateNoteRequest request) {
		Note note = requirePasswordMatch(id, request.password());
		String encodedPassword = request.newPassword() == null
			? null
			: passwordEncoder.encode(request.newPassword());
		note.update(request.author(), request.title(), request.content(), encodedPassword);
		return NoteMapper.toResponse(note);
	}

	@Transactional
	public void deleteNote(Long id, DeleteNoteRequest request) {
		Note note = requirePasswordMatch(id, request.password());
		noteRepository.delete(note);
	}

	private NotePageResponse olderPage(Long cursor, int pageSize) {
		List<Note> notes = new ArrayList<>(
			noteRepository.findByIdLessThanOrderByIdDesc(cursor, PageRequest.of(0, pageSize + 1))
		);
		boolean hasOlder = notes.size() > pageSize;
		if (hasOlder) {
			notes = notes.subList(0, pageSize);
		}
		boolean hasNewer = noteRepository.existsByIdGreaterThanEqual(cursor);
		return new NotePageResponse(toResponses(notes), hasOlder, hasNewer);
	}

	private NotePageResponse newerPage(Long cursor, int pageSize) {
		List<Note> notes = new ArrayList<>(
			noteRepository.findByIdGreaterThanOrderByIdAsc(cursor, PageRequest.of(0, pageSize + 1))
		);
		boolean hasNewer = notes.size() > pageSize;
		if (hasNewer) {
			notes = new ArrayList<>(notes.subList(0, pageSize));
		}
		Collections.reverse(notes);
		boolean hasOlder = noteRepository.existsByIdLessThanEqual(cursor);
		return new NotePageResponse(toResponses(notes), hasOlder, hasNewer);
	}

	private Note requirePasswordMatch(Long id, String rawPassword) {
		Note note = noteRepository.findById(id).orElseThrow(InvalidPasswordException::new);
		if (!passwordEncoder.matches(rawPassword, note.getPassword())) {
			throw new InvalidPasswordException();
		}
		return note;
	}

	private List<NoteResponse> toResponses(List<Note> notes) {
		return notes.stream().map(NoteMapper::toResponse).toList();
	}
}
