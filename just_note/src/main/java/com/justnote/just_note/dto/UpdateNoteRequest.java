package com.justnote.just_note.dto;

public record UpdateNoteRequest(
	String password,
	String author,
	String title,
	String content,
	String newPassword
) {
}
