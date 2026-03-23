import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Note } from '../note';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css'],
  imports: [FormsModule]
})
export class NoteEditorComponent implements OnInit {
  @Input() note!: Note;
  @Output() noteSaved = new EventEmitter<Note>();
  @Output() noteClosed = new EventEmitter<void>();
  @Output() noteDeleted = new EventEmitter<Note>();

  @ViewChild('bodyInput') bodyInput!: ElementRef<HTMLTextAreaElement>;

  editNote!: Note;
  moreMenuOpen = false;


  ngOnInit() {
    // Work on a deep copy so changes don't mutate the list until saved
    this.editNote = { ...this.note, labels: [...(this.note.labels ?? [])] };
  }

  ngAfterViewInit() {
    // Auto-resize textarea on open
    this.autoResize({ target: this.bodyInput.nativeElement } as any);
  }

  autoResize(event: Event) {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  togglePin()         { this.editNote.pinned = !this.editNote.pinned; }
  toggleMoreMenu()    { this.moreMenuOpen = !this.moreMenuOpen; }

  setColor(value: string) {
    this.editNote.color = value || undefined;
  }

  removeLabel(e: Event, label: string) {
    e.stopPropagation();
    this.editNote.labels = this.editNote.labels?.filter(l => l !== label);
  }

  onClose() {
    this.noteSaved.emit({ ...this.editNote});
    this.noteClosed.emit();
  }

  onBackdropClick() { this.onClose(); }

  onDelete() {
    this.noteDeleted.emit(this.editNote);
    this.noteClosed.emit();
  }


  onAddLabel()        { /* open label picker */ }
  onMakeCopy()        { /* clone note via NoteService */ }
  onLabelClick(l: string) { /* navigate to label view */ }

}