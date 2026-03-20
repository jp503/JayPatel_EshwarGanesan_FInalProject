package com.example.backend.controller;

import com.example.backend.dto.TagDto;
import com.example.backend.dto.TagSummaryDto;
import com.example.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping
    public List<TagDto> getAllTags() {
        return tagService.getAllTags();
    }

    @GetMapping("/{id}/notes")
    public ResponseEntity<TagDto> getTagWithNotes(@PathVariable Long id) {
        return tagService.getTagWithNotes(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TagSummaryDto> createTag(@RequestBody TagSummaryDto dto) {
        TagSummaryDto created = tagService.createTag(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagSummaryDto> renameTag(@PathVariable Long id,
                                                   @RequestBody TagSummaryDto dto) {
        return tagService.renameTag(id, dto.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

}
