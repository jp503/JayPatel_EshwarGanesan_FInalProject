import { Component, Input, Output, EventEmitter, HostListener, ElementRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../note';
import { TagServiceService } from '../tag-service.service';
import { Tag } from '../tag';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css'],
  imports: [CommonModule, FormsModule]
})
export class NoteCardComponent {
  @Input() note!: Note;

  @Output() cardClick = new EventEmitter<Note>();
  @Output() pinToggle = new EventEmitter<Note>();
  @Output() archive   = new EventEmitter<Note>();
  @Output() colorChange = new EventEmitter<Note>();
  @Output() deleteNote = new EventEmitter<Note>();
  @Output() labelChange = new EventEmitter<Note>();

  constructor(private tagService: TagServiceService, private elementRef: ElementRef) {}

  hovered = false;

  labelPickerOpen = false;
  searchTextSignal = signal('');

  get availableLabels() {
    return this.tagService.allTags;
  }

  filteredLabels = computed(() => {
    const q = this.searchTextSignal().toLowerCase().trim();
    const labels = this.availableLabels();
    
    if (!q) return labels;
    return labels.filter(l => l.name.toLowerCase().includes(q));
  })

hasLabel(label: Tag): boolean {
  return this.note.tags?.includes(label.name) ?? false;
}

toggleLabel(e: Event, label: Tag) {
  e.stopPropagation();
  const tags = this.note.tags ? [...this.note.tags] : [];
  const idx = tags.indexOf(label.name);
  if (idx > -1) {
    tags.splice(idx, 1);
  } else {
    tags.push(label.name);
  }
  const updated = { ...this.note, tags };
  this.labelChange.emit(updated);
}

  closeLabelPicker() {
    this.labelPickerOpen = false;
    this.searchTextSignal.set('');
  }

  onCardClick()          { this.cardClick.emit(this.note); }
  onPin(e: Event)        { e.stopPropagation(); this.pinToggle.emit(this.note); }
  onArchive(e: Event)    { e.stopPropagation(); this.archive.emit(this.note); }
  onChangeColor(e: Event){ e.stopPropagation(); this.colorChange.emit(this.note); }
  onAddCollaborator(e: Event){ e.stopPropagation(); }
  onMore(e: Event)       { e.stopPropagation(); }
  onDelete(e: Event)     { e.stopPropagation(); this.deleteNote.emit(this.note); }
  onAddLabel(e: Event) {
  e.stopPropagation();
  this.labelPickerOpen = !this.labelPickerOpen;
  this.searchTextSignal.set('');
}

@HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.labelPickerOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeLabelPicker();
    }
  }
}