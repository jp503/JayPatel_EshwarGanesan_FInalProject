package com.example.backend.controller;

import com.example.backend.repository.NoteRepository;
import com.example.backend.repository.TagRepository;
import com.example.backend.service.NoteService;
import com.example.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PingController {
    @Autowired private NoteService noteService;
    @Autowired private TagService tagService;


    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of("message", "WORKS");
    }

    @GetMapping("/db-check")
    public Map<String, Object> dbCheck() {
        return Map.of(
                "notes",  noteService.getAllNotes(),
                "tags",   tagService.getAllTags(),
                "status", "connected"
        );
    }
}
