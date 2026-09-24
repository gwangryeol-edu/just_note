package com.justnote.just_note.dto;

public record CreateNoteRequest(String author, String password, String title, String content) {
}
