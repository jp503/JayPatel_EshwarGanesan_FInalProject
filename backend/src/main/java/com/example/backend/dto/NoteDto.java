package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class NoteDto {
    private Long id;
    private String title;
    private String content;
    private List<TagSummaryDto> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean pinned;
    private LocalDateTime pinnedAt;

    public NoteDto(Long id, String title, String content,
                   List<TagSummaryDto> tags,
                   LocalDateTime createdAt, LocalDateTime updatedAt, boolean pinned, LocalDateTime pinnedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.pinned = pinned;
        this.pinnedAt = pinnedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public List<TagSummaryDto> getTags() {
        return tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public boolean isPinned() {
        return pinned;
    }

    public LocalDateTime getPinnedAt() {
        return pinnedAt;
    }
}
