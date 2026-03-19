import { Component, Input } from '@angular/core';
import { Note } from '../note';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-list',
  standalone: true,
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  imports: [CommonModule]
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Input() isListView: boolean = false;

  creatorExpanded = false;

  get pinnedNotes() { return this.notes.filter(n => n.pinned); }
  get otherNotes()  { return this.notes.filter(n => !n.pinned); }

  onCreatorFocus()  { this.creatorExpanded = true; }
  onCreatorClose()  { this.creatorExpanded = false; }
}