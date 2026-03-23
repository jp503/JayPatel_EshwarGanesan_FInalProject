import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  labels: string[] = [];
   editingLabels = false;
  newLabelText = '';
  editingIndex: number | null = null;
  editingText = '';

  ngOnInit() {
    // Seed with some default labels — swap this out for a LabelService call later
    this.labels = ['Personal', 'Work'];
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
