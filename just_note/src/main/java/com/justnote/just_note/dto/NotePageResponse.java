package com.justnote.just_note.dto;

import java.util.List;

public record NotePageResponse(List<NoteResponse> notes, boolean hasOlder, boolean hasNewer) {
}
