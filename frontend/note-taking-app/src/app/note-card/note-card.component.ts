import { Component, Input, Output, EventEmitter, HostListener, ElementRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../note';
import { TagServiceService } from '../tag-service.service';
import { Tag } from '../tag';
import { NoteServiceService } from '../note-service.service';

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

  constructor(private tagService: TagServiceService, private noteService: NoteServiceService, private elementRef: ElementRef) {}

  hovered = false;

  labelPickerOpen = false;
  searchTextSignal = signal('');

  get availableLabels() {
    return this.tagService.allTags;
  }

  filteredLabels = computed(() => {
    const q = this.searchTextSignal().toLowerCase().trim();
    const labels = this.tagService.allTags();
    
    if (!q) return labels;
    return labels.filter(l => l.name.toLowerCase().includes(q));
  })

hasLabel(label: Tag): boolean {
    const liveNote = this.noteService.allNotes().find(n => n.id === this.note.id);
    return liveNote?.tags?.includes(label.name) ?? false;
}

toggleLabel(e: Event, label: Tag) {
 e.stopPropagation();
    const alreadyHas = this.hasLabel(label);

    if (alreadyHas) {
      this.noteService.removeTagFromNote(this.note.id, label.id, label.name).subscribe({
        next: (updated) => this.labelChange.emit(updated),
        error: (err) => console.error('Failed to remove tag', err)
      });
    } else {
      this.noteService.addTagToNote(this.note.id, label.id, label.name).subscribe({
        next: (updated) => this.labelChange.emit(updated),
        error: (err) => console.error('Failed to add tag', err)
      });
    }
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