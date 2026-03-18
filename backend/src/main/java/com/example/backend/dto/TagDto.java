package com.example.backend.dto;

import java.util.List;

public class TagDto {
    private Long id;
    private String name;
    private List<NoteSummaryDto> notes;

    public TagDto(Long id, String name, List<NoteSummaryDto> notes) {
        this.id = id;
        this.name = name;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<NoteSummaryDto> getNotes() {
        return notes;
    }
}
