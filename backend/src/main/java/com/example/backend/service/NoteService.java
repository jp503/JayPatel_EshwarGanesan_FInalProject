package com.example.backend.service;

import com.example.backend.dto.NoteDto;
import com.example.backend.dto.TagSummaryDto;
import com.example.backend.model.Note;
import com.example.backend.model.Tag;
import com.example.backend.repository.NoteRepository;
import com.example.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired private BCryptPasswordEncoder passwordEncoder;

    public List<NoteDto> getAllNotes() {
        return noteRepository.findAllWithTagsSorted()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<NoteDto> getNodeById(Long id) {
        return noteRepository.findByIdWithTags(id).map(this::toDto);
    }

    //may already be implemented in frontend
    public List<NoteDto> searchNotes(String q) {
        return noteRepository.searchByKeyword(q)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<NoteDto> filterByTags(List<String> tagNames) {
        return noteRepository.findByTagNames(tagNames)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public NoteDto createNote(NoteDto dto) {
        Note note = new Note();
        note.setTitle(dto.getTitle());
        note.setContent(dto.getContent());

        //extract entity tags from dto tags via id coming from dto
        if (dto.getTags() != null) {
            Set<Tag> tags = dto.getTags().stream()
                    .map(t -> tagRepository.findById(t.getId()).orElseThrow(
                            () -> new RuntimeException("Tag not found: " + t.getId())))
                    .collect(Collectors.toSet());
            note.setTags(tags);
        }

        return toDto(noteRepository.save(note));

    }

    public Optional <NoteDto> updateNote(Long id, NoteDto dto) {
        return noteRepository.findByIdWithTags(id).map(note -> {
            note.setTitle(dto.getTitle());
            note.setContent(dto.getContent());

            if (dto.getTags() != null) {
                Set<Tag> tags = dto.getTags().stream()
                        .map(t -> tagRepository.findById(t.getId()).orElseThrow(
                                () -> new RuntimeException("Tag not found " + t.getId())))
                        .collect(Collectors.toSet());
                note.setTags(tags);
            }
            return toDto(noteRepository.save(note));
        });
    }

    public Optional<NoteDto> partialUpdate(Long id, Map<String, String> fields) {
        return noteRepository.findByIdWithTags(id).map(note -> {
            if (fields.containsKey("title"))   note.setTitle(fields.get("title"));
            if (fields.containsKey("content")) note.setContent(fields.get("content"));
            return toDto(noteRepository.save(note));
        });
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    public Optional<NoteDto> addTagToNote(Long noteId, Long tagId) {
        return noteRepository.findByIdWithTags(noteId).map(note -> {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Tag not found: " + tagId));
            note.getTags().add(tag);
            return toDto(noteRepository.save(note));
        });
    }

    public Optional<NoteDto> removeTagFromNote(Long noteId, Long tagId) {
        return noteRepository.findByIdWithTags(noteId).map(note -> {
            note.getTags().removeIf(t -> t.getId().equals(tagId));
            return toDto(noteRepository.save(note));
        });
    }

    public Optional<NoteDto> togglePin(Long id) {
        return noteRepository.findByIdWithTags(id).map(note -> {
            note.setPinned(!note.isPinned());
            note.setPinnedAt(note.isPinned() ? LocalDateTime.now() : null);
            return toDto(noteRepository.save(note));
        });
    }

    public Optional<NoteDto> setPassword(Long id, String rawPassword) {
        return noteRepository.findByIdWithTags(id).map(note -> {
            note.setPasswordProtected(true);
            note.setPasswordHash(passwordEncoder.encode(rawPassword));
            return toDto(noteRepository.save(note));
        });
    }

    public Optional<NoteDto> removePassword(Long id, String rawPassword) {
        return noteRepository.findByIdWithTags(id).map(note -> {
            if (!note.isPasswordProtected()) {
                throw new RuntimeException("Note is not password protected");
            }
            if (!passwordEncoder.matches(rawPassword, note.getPasswordHash())) {
                throw new RuntimeException("Incorrect password");
            }
            note.setPasswordProtected(false);
            note.setPasswordHash(null);
            return toDto(noteRepository.save(note));
        });
    }

    public Optional<NoteDto> verifyPassword(Long id, String rawPassword) {
        return noteRepository.findByIdWithTags(id).map(note -> {
            if (!note.isPasswordProtected()) {
                return toDto(note);
            }
            if (!passwordEncoder.matches(rawPassword, note.getPasswordHash())) {
                throw new RuntimeException("Incorrect password");
            }
            return toDto(note);
        });
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
                note.getUpdatedAt(),
                note.isPinned(),
                note.getPinnedAt(),
                note.isPasswordProtected()
        );
    }
}
