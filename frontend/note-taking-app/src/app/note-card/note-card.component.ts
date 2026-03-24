import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../note';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css'],
  imports: [CommonModule]
})
export class NoteCardComponent {
  @Input() note!: Note;

  @Output() cardClick = new EventEmitter<Note>();
  @Output() pinToggle = new EventEmitter<Note>();
  @Output() archive   = new EventEmitter<Note>();
  @Output() colorChange = new EventEmitter<Note>();
  @Output() deleteNote = new EventEmitter<Note>();

  hovered = false;

  onCardClick()          { this.cardClick.emit(this.note); }
  onPin(e: Event)        { e.stopPropagation(); this.pinToggle.emit(this.note); }
  onArchive(e: Event)    { e.stopPropagation(); this.archive.emit(this.note); }
  onChangeColor(e: Event){ e.stopPropagation(); this.colorChange.emit(this.note); }
  onAddCollaborator(e: Event){ e.stopPropagation(); }
  onMore(e: Event)       { e.stopPropagation(); }
  onDelete(e: Event)     { e.stopPropagation(); this.deleteNote.emit(this.note); }
}