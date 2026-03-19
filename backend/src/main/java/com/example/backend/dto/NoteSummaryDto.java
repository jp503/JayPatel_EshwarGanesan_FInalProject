package com.example.backend.dto;

public class NoteSummaryDto {
    private Long id;
    private String title;

    public NoteSummaryDto(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }
}
