package com.example.backend.controller;

import com.example.backend.dto.NoteDto;
import com.example.backend.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public List<NoteDto> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDto> getNoteById(@PathVariable Long id) {
        return noteService.getNodeById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<NoteDto> searchNotes(@RequestParam String q) {
        return noteService.searchNotes(q);
    }

    @GetMapping("/filter")
    public List<NoteDto> filterByTags(@RequestParam List<String> tags) {
        return noteService.filterByTags(tags);
    }

    @PostMapping
    public ResponseEntity<NoteDto> createNote(@RequestBody NoteDto noteDto) {
        NoteDto created = noteService.createNote(noteDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDto> updateNote(@PathVariable Long id, @RequestBody NoteDto noteDto) {
        return noteService.updateNote(id, noteDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<NoteDto> partialUpdate(@PathVariable Long id, @RequestBody Map<String, String> fields) {
        return noteService.partialUpdate(id, fields)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/tags/{tagId}")
    public ResponseEntity<NoteDto> addTagToNote(@PathVariable Long id,
                                                @PathVariable Long tagId) {
        return noteService.addTagToNote(id, tagId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/tags/{tagId}")
    public ResponseEntity<NoteDto> removeTagFromNote(@PathVariable Long id,
                                                     @PathVariable Long tagId) {
        return noteService.removeTagFromNote(id, tagId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
