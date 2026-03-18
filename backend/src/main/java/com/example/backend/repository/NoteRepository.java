package com.example.backend.repository;

import com.example.backend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // Find all notes that have ALL of the given tags
    @Query("SELECT DISTINCT n FROM Note n JOIN n.tags t WHERE t.name IN :tagNames")
    List<Note> findByTagNames(@Param("tagNames") List<String> tagNames);

    @Query("SELECT DISTINCT n FROM Note n LEFT JOIN FETCH n.tags")
    List<Note> findAllWithTags();
}
