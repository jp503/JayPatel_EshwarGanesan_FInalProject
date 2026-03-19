package com.example.backend.service;

import com.example.backend.dto.NoteDto;
import com.example.backend.dto.TagSummaryDto;
import com.example.backend.model.Note;
import com.example.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<NoteDto> getAllNotes() {
        return noteRepository.findAllWithTags()
                .stream()
                .map(this:: toDto)
                .collect(Collectors.toList());
    }

    private NoteDto toDto(Note note) {
        List<TagSummaryDto> tags = note.getTags()
                .stream()
                .map(t -> new TagSummaryDto(t.getId(), t.getName()))
                .collect(Collectors.toList());

        return new NoteDto(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                tags,
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
