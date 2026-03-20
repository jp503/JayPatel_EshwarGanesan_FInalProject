package com.example.backend.repository;

import com.example.backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query("SELECT DISTINCT t FROM Tag t LEFT JOIN FETCH t.notes")
    List<Tag> findAllWithNotes();

    @Query("SELECT DISTINCT t FROM Tag t LEFT JOIN FETCH t.notes WHERE t.id = :id")
    Optional<Tag> findByIdWithNotes(@Param("id") Long id);
}
