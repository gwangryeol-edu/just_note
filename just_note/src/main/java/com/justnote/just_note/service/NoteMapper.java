package com.justnote.just_note.service;

import com.justnote.just_note.dto.NoteResponse;
import com.justnote.just_note.entity.Note;

final class NoteMapper {

	private NoteMapper() {
	}

	static NoteResponse toResponse(Note note) {
		return new NoteResponse(
			note.getId(),
			note.getAuthor(),
			note.getTitle(),
			note.getContent(),
			note.getCreatedAt(),
			note.getUpdatedAt()
		);
	}
}
