package com.example.backend.repository;

import com.example.backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query("SELECT DISTINCT t FROM Tag t LEFT JOIN FETCH t.notes")
    List<Tag> findAllWithNotes();
}
