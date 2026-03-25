import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagServiceService } from '../tag-service.service';
import { Tag } from '../tag';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent{
  @Input() labels: Tag[] = [];
  editingLabels = false;
  newLabelText = '';
  editingIndex: number | null = null;
  editingText = '';

  constructor(private tagService: TagServiceService) {}

  ngOnInit(): void {
    this.tagService.getAllTags().subscribe({
      next: (t) => this.labels = t,
      error: (err) => console.error('Failed to load tags', err)
    });
  }

  toggleEditing() {
    this.editingLabels = !this.editingLabels;
    this.newLabelText = '';
    this.editingIndex = null;
  }

  addLabel() {
    const trimmed = this.newLabelText.trim();

   if (!trimmed) return;

  // check by name
  if (this.labels.some(t => t.name === trimmed)) return;

  this.tagService.createTag(trimmed).subscribe({
    next: (createdTag) => {
      this.labels.push(createdTag); 
      console.log('Tag created');
    },
    error: (err) => console.error('Failed to create tag', err)
  });

  this.newLabelText = '';
  }

  onNewLabelKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.addLabel();
    if (event.key === 'Escape') this.newLabelText = '';
  }

  startEditing(index: number) {
    this.editingIndex = index;
    this.editingText = this.labels[index].name;
  }

  saveEdit(index: number) {
    const trimmed = this.editingText.trim();
    const tag = this.labels[index];

    if (!trimmed) return;

    if (this.labels.some(t => t.name === trimmed)) return;

    this.tagService.updateTag(tag.id, trimmed).subscribe({
      next: (updatedTag) => {
        this.labels[index] = updatedTag; 
        console.log('Tag updated');
      },
      error: (err) => console.error('Failed to update tag', err)
  });

  this.editingIndex = null;
  }

  onEditKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') this.saveEdit(index);
    if (event.key === 'Escape') this.editingIndex = null;
  }

  deleteLabel(index: number) {
    const tag = this.labels[index];

    this.tagService.deleteTag(tag.id).subscribe({
      next: () => {
        this.labels.splice(index, 1); 
        console.log('Tag deleted');
      },
      error: (err) => console.error('Failed to delete tag', err)
    });

    if (this.editingIndex === index) this.editingIndex = null;
  }
}
