import { Component, Input, computed, signal } from '@angular/core';
import { Note } from '../note';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { NoteServiceService } from '../note-service.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { TagServiceService } from '../tag-service.service';


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
  constructor(private noteService: NoteServiceService, private tagService: TagServiceService) {}

  get notes() { return this.noteService.allNotes; }
  @Input() isListView: boolean = false;

  
  creatorExpanded = false;
  selectedNote: Note | null = null;

  passwordPromptNote: Note | null = null;
  unlockPromptNote: Note | null = null;
  lockPromptNote: Note | null = null;
  passwordInput = '';
  passwordError = '';
  passwordLoading = false;

  private searchTextSignal = signal('');

@Input() set searchText(value: string) {
  this.searchTextSignal.set(value || '');
}

filteredNotes = computed(() => {
  const q = this.searchTextSignal().toLowerCase().trim();
  const notes = this.noteService.allNotes();

  if (!q) return notes;

  return notes.filter(n =>
    JSON.stringify(n).toLowerCase().includes(q)
  );
});

pinnedNotes = computed(() =>
  this.filteredNotes().filter(n => n.pinned)
);

otherNotes = computed(() =>
  this.filteredNotes().filter(n => !n.pinned)
);

  onCardClick(note: Note) { 
    if (note.passwordProtected) {
      this.passwordPromptNote = note;
      this.passwordInput = '';
      this.passwordError = '';
    } else {
      this.selectedNote = { ...note };
    }
  }

  onPasswordSubmit() {
    this.passwordLoading = true;
    this.passwordError = '';
    if (this.passwordPromptNote) {

      this.noteService.decryptNote(this.passwordPromptNote.id, this.passwordInput).subscribe({
        next: (unlockedNote) => {
          this.passwordLoading = false;
          this.selectedNote = { ...unlockedNote };
          this.passwordPromptNote = null;
          this.passwordInput = '';
        },
      error: () => {
        this.passwordLoading = false;
        this.passwordError = 'Incorrect password. Please try again.';
      }
    });
    }
    else if (this.lockPromptNote) {
      this.noteService.lockNote(this.lockPromptNote.id, this.passwordInput).subscribe({
        next: () => {
          this.passwordLoading = false;
          this.lockPromptNote = null;
          this.passwordInput = '';
        },
      error: () => {
        this.passwordLoading = false;
        this.passwordError = 'Failed to lock note. Please try again.';
      }
    });
    }
    else if (this.unlockPromptNote) {
      this.noteService.unlockNote(this.unlockPromptNote.id, this.passwordInput).subscribe({
        next: () => {
          this.passwordLoading = false;
          this.unlockPromptNote = null;
          this.passwordInput = '';
        },
        error: () => {
          this.passwordLoading = false;
          this.passwordError = 'Failed to unlock note. Please try again.';
        }
      });
    }
  }

  onPasswordCancel() {
    this.passwordPromptNote = null;
    this.lockPromptNote = null;
    this.unlockPromptNote = null;
    this.passwordInput = '';
    this.passwordError = '';
  }

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
    const allTags = this.tagService.allTags();

    // Convert tag name strings back to Tag objects for the backend
    const hydratedTags = (note.tags ?? [])
      .map(tagName => allTags.find(t => t.name === tagName))
      .filter(t => t !== undefined);

    const payload = { ...note, tags: hydratedTags };

    this.noteService.updateNote(payload as any).subscribe({
      next: () => console.log('Note updated'),
      error: (err) => console.error('Failed to update note', err)
    });
    this.selectedNote = null;
  }

  onNoteDeleted(note: Note)   {
  this.noteService.deleteNote(note).subscribe({
    next: () => {
      this.selectedNote = null;
      console.log('Note deleted');
    },
    error: (err) => console.error('Failed to delete note', err)
  });
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
      next: () => {
        this.newNoteTitle = '';
        this.newNoteBody = '';
        console.log('Note saved');
      },
      error: (err) => console.error('Failed to create note', err)
    });
  }
}

  onCreatorFocus()  { this.creatorExpanded = true; }

  onBackdropClick() { this.onCreatorClose(); }

  onCreatorClose()  { 
    this.creatorExpanded = false;
    this.saveNewNote();
  }

  onLockNote(note: Note) {
    this.lockPromptNote = note;
    this.passwordInput = '';
    this.passwordError = '';
  }

  onUnlockNote(note: Note) {
    this.unlockPromptNote = note;
    this.passwordInput = '';
    this.passwordError = '';
  }

  trackByNoteId(index: number, note: Note): number {
  return note.id;
  }

}