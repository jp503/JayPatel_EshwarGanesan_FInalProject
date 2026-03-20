import { Component, Input } from '@angular/core';
import { Note } from '../note';
import { CommonModule } from '@angular/common';
import { NoteCardComponent } from '../note-card/note-card.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  imports: [CommonModule, NoteCardComponent]
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() isListView: boolean = false;

  creatorExpanded = false;

  onCardClick(note: Note) { console.log('Card clicked:', note); }
  onPinToggle(note: Note)   { note.pinned = !note.pinned; }

  get pinnedNotes() { return this.notes.filter(n => n.pinned); }
  get otherNotes()  { return this.notes.filter(n => !n.pinned); }

  onCreatorFocus()  { this.creatorExpanded = true; }
  onCreatorClose()  { this.creatorExpanded = false; }
}