package com.example.backend.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;


    @ManyToMany(mappedBy = "tags", fetch = FetchType.EAGER)
    private Set<Note> notes = new HashSet<>();

    public Set<Note> getNotes() { return notes; }

}
