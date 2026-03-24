import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Note } from '../note';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { NoteServiceService } from '../note-service.service';
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
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  @Input() isListView: boolean = false;
  @Input() searchText: string = '';

  constructor(private noteService: NoteServiceService) {}

  
  creatorExpanded = false;
  selectedNote: Note | null = null;

  ngOnInit(): void {
    this.loadNotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const q = (this.searchText || '').toLowerCase().trim();
    if (!q) {
      this.filteredNotes = this.notes;
      return;
    }
    this.filteredNotes = this.notes.filter(n => JSON.stringify(n).toLowerCase().includes(q));
  }

  onCardClick(note: Note) { this.selectedNote = {...note}; }

  onEditorClose() { 
    setTimeout(() => {
    this.selectedNote = null;
  }, 150);
}

  onPinToggle(note: Note)   { 
    note.pinned = !note.pinned;
    this.noteService.pinNote(note).subscribe({
      next: () => console.log('Note pin toggled'),
      error: (err) => console.error('Failed to toggle pin', err)
    });
  }

  onNoteSaved(note: Note)    {
  const idx = this.notes.findIndex(n => n.id === note.id);
  if (idx > -1) this.notes[idx] = note;

  this.noteService.updateNote(note).subscribe({
    next: () => console.log('Note updated'),
    error: (err) => console.error('Failed to update note', err)
  });
  this.selectedNote = null;
}
  onNoteDeleted(note: Note)   {
  this.noteService.deleteNote(note).subscribe({
    next: () => {
      this.notes = this.notes.filter(n => n.id !== note.id);
      this.filteredNotes = this.filteredNotes.filter(n => n.id !== note.id);
      this.selectedNote = null;
      console.log('Note deleted');
    },
    error: (err) => console.error('Failed to delete note', err)
  });
  this.selectedNote = null;
}

newNoteTitle = '';
newNoteBody = '';

saveNewNote() {
  // Only save if there's actual content
  if (this.newNoteTitle || this.newNoteBody) {
    const note: Partial<Note> = {
      title: this.newNoteTitle,
      content: this.newNoteBody,
      tags: [],
    };
    this.noteService.createNote(note as Note).subscribe({
      next: (createdNote: Note) => {
        this.notes = [createdNote, ...this.notes];
        this.newNoteTitle = '';
        this.newNoteBody = '';
        console.log('Note saved');
      },
      error: (err) => console.error('Failed to create note', err)
    });
  }
}

loadNotes() {
  this.noteService.getAllNotes().subscribe({
      next: (n) => {
        this.notes = n;
        this.filteredNotes = n;
        console.log('Notes loaded');
      },
      error: (err) => console.error('Failed to load notes', err)
    });
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