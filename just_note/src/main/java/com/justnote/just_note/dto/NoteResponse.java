package com.justnote.just_note.dto;

import java.time.LocalDateTime;

public record NoteResponse(
	Long id,
	String author,
	String title,
	String content,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}
