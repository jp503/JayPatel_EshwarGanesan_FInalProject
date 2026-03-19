package com.example.backend.service;

import com.example.backend.dto.NoteSummaryDto;
import com.example.backend.dto.TagDto;
import com.example.backend.dto.TagSummaryDto;
import com.example.backend.model.Tag;
import com.example.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public List<TagDto> getAllTags() {
        return tagRepository.findAllWithNotes()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<TagDto> getTagWithNotes(Long id) {
        return tagRepository.findByIdWithNotes(id).map(this::toDto);
    }

    public TagSummaryDto createTag(TagSummaryDto dto) {
        Tag tag = new Tag();
        tag.setName(dto.getName());
        Tag saved = tagRepository.save(tag);
        return new TagSummaryDto(saved.getId(), saved.getName());
    }

    public Optional<TagSummaryDto> renameTag(Long id, String newName) {
        return tagRepository.findById(id).map(tag -> {
            tag.setName(newName);
            Tag saved = tagRepository.save(tag);
            return new TagSummaryDto(saved.getId(), saved.getName());
        });
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }



    private TagDto toDto(Tag tag) {
        List<NoteSummaryDto> notes = tag.getNotes()
                .stream()
                .map(n -> new NoteSummaryDto(n.getId(), n.getTitle()))
                .collect(Collectors.toList());

        return new TagDto(tag.getId(), tag.getName(), notes);
    }
}
