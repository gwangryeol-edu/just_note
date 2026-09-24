package com.justnote.just_note.repository;

import com.justnote.just_note.entity.Note;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {

	List<Note> findAllByOrderByIdDesc(Pageable pageable);

	List<Note> findByIdLessThanOrderByIdDesc(Long cursor, Pageable pageable);

	List<Note> findByIdGreaterThanOrderByIdAsc(Long cursor, Pageable pageable);

	boolean existsByIdGreaterThanEqual(Long id);

	boolean existsByIdLessThanEqual(Long id);

	List<Note> findByAuthor(String author);
}
