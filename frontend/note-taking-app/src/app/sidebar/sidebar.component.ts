import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagServiceService } from '../tag-service.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent{
  @Input() labels: string[] = [];
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
    if (trimmed && !this.labels.includes(trimmed)) {
      this.labels.push(trimmed);
    }
    this.newLabelText = '';
  }

  onNewLabelKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.addLabel();
    if (event.key === 'Escape') this.newLabelText = '';
  }

  startEditing(index: number) {
    this.editingIndex = index;
    this.editingText = this.labels[index];
  }

  saveEdit(index: number) {
    const trimmed = this.editingText.trim();
    if (trimmed && !this.labels.includes(trimmed)) {
      this.labels[index] = trimmed;
    }
    this.editingIndex = null;
  }

  onEditKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') this.saveEdit(index);
    if (event.key === 'Escape') this.editingIndex = null;
  }

  deleteLabel(index: number) {
    this.labels.splice(index, 1);
    if (this.editingIndex === index) this.editingIndex = null;
  }
}
