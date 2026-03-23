import { Component, Input } from '@angular/core';
import { Note } from '../note';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-note-list',
  standalone: true,
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  imports: [CommonModule, NoteCardComponent, NoteEditorComponent, FormsModule],
  animations: [
    trigger('cardReveal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.97)' }),
        animate('800ms ease', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() isListView: boolean = false;

  creatorExpanded = false;
  selectedNote: Note | null = null;

  onCardClick(note: Note) { this.selectedNote = {...note}; }
  onEditorClose() { 
    setTimeout(() => {
    this.selectedNote = null;
  }, 150);}
  onPinToggle(note: Note)   { note.pinned = !note.pinned; }
  onNoteSaved(note: Note)    {
  const idx = this.notes.findIndex(n => n.id === note.id);
  if (idx > -1) this.notes[idx] = note;
  this.selectedNote = null;
}

newNoteTitle = '';
newNoteBody = '';

saveNewNote() {
  // Only save if there's actual content
  if (this.newNoteTitle || this.newNoteBody) {
    const note: Note = {
      id: crypto.randomUUID(),
      title: this.newNoteTitle,
      body: this.newNoteBody,
    };
    this.notes = [note, ...this.notes];
    this.newNoteTitle = '';
    this.newNoteBody = '';
  }
}

  get pinnedNotes() { return this.notes.filter(n => n.pinned); }
  get otherNotes()  { return this.notes.filter(n => !n.pinned); }

  onCreatorFocus()  { this.creatorExpanded = true; }
  onBackdropClick() { this.onCreatorClose(); }
  onCreatorClose()  { 
    this.creatorExpanded = false;
    this.saveNewNote();
  }

  trackByNoteId(index: number, note: Note): string {
  return note.id;
}
}