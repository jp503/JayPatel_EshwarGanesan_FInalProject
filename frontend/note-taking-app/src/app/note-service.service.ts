import { Injectable, signal, computed } from '@angular/core';
import { Note } from './note';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  private notes = signal<Note[]>([]);

  public readonly allNotes = this.notes;
  private baseUrl = 'http://localhost:8080'; // adjust port/path as needed

  constructor(private http: HttpClient) {
    this.loadNotes();
   }

  /**
   * Return observable of notes from backend API.
   * Adjust the path (`/api/notes`) if your controller uses a different mapping.
   */
  getAllNotes(): Observable<Note[]> {
    return this.http
      .get<{
        id: number;
        title: string;
        content: string;
        tags?: { id: number; name: string }[];
        createdAt?: string;
        updatedAt?: string;
        pinned?: boolean;
        pinnedAt?: string | null;
        passwordProtected?: boolean;
      }[]>(`${this.baseUrl}/api/notes`)
      .pipe(
        map(notes =>
          notes.map(n => this.normalizeNote(n))
        )
      );
  }

  /**
   * Fetch notes and populate the internal signal.
   */
  loadNotes(): void {
    this.getAllNotes().subscribe({
      next: (n) => this.notes.set(n),
      error: (err) => console.error('Failed to load notes', err)
    });
  }

  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(`${this.baseUrl}/api/notes`, note).pipe(
      map(createdNote => {
        const current = this.notes();
        this.notes.set([createdNote, ...current]);
        return createdNote;
      })
    );
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/api/notes/${note.id}`, note).pipe(
      map(updatedNote => {
      const normalized = this.normalizeNote(updatedNote);
      const current = this.notes();
      const idx = current.findIndex(n => n.id === normalized.id);
      if (idx > -1) {
        current[idx] = normalized;
        this.notes.set([...current]);
      }
      return normalized;
    })
    );
  }

  deleteNote(note: Note): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/notes/${note.id}`).pipe(
      map(() => {
        const current = this.notes();
        this.notes.set(current.filter(n => n.id !== note.id));
      })
    );
  }

  pinNote(note: Note): Observable<Note> {
    return this.http.patch<Note>(`${this.baseUrl}/api/notes/${note.id}/pin`, {}).pipe(
      map(updatedNote => {
      const normalized = this.normalizeNote(updatedNote);
      const current = this.notes();
      const idx = current.findIndex(n => n.id === normalized.id);
      if (idx > -1) {
        current[idx] = normalized;
        this.notes.set([...current]);
      }
      return normalized;
    })
    );
  }

  addTagToNote(noteId: number, tagId: number, tagName: string): Observable<Note> {
    const snapshot = this.applyOptimisticTagUpdate(noteId, tagName, true);

    return this.http.post<Note>(`${this.baseUrl}/api/notes/${noteId}/tags/${tagId}`, {}).pipe(
      map(updatedNote => {
      const normalized = this.normalizeNote(updatedNote);
      const current = this.notes();
      const idx = current.findIndex(n => n.id === normalized.id);
      if (idx > -1) {
        current[idx] = normalized;
        this.notes.set([...current]);
      }
      return normalized;
    })
    );
  }

  removeTagFromNote(noteId: number, tagId: number, tagName: string): Observable<Note> {
    const snapshot = this.applyOptimisticTagUpdate(noteId, tagName, false);

    return this.http.delete<Note>(`${this.baseUrl}/api/notes/${noteId}/tags/${tagId}`).pipe(
      map(updatedNote => {
      const normalized = this.normalizeNote(updatedNote);
      const current = this.notes();
      const idx = current.findIndex(n => n.id === normalized.id);
      if (idx > -1) {
        current[idx] = normalized;
        this.notes.set([...current]);
      }
      return normalized;
    })
    );
  }

  private normalizeNote(raw: any): Note {
  return {
    ...raw,
    tags: raw.tags ? raw.tags.map((t: any) => t.name ?? t) : []
  };
}

private applyOptimisticTagUpdate(noteId: number, tagName: string, add: boolean): Note[] {
  const current = this.notes();
  const idx = current.findIndex(n => n.id === noteId);
  if (idx === -1) return current;

  const note = current[idx];
  const tags = note.tags ? [...note.tags] : [];
  const updated = add
    ? [...tags, tagName]
    : tags.filter(t => t !== tagName);

  const updatedNotes = [...current];
  updatedNotes[idx] = { ...note, tags: updated };
  this.notes.set(updatedNotes);
  return current; // return snapshot for rollback
}

decryptNote(noteId: number, password: string): Observable<Note> {
  return this.http.post<any>(
    `${this.baseUrl}/api/notes/${noteId}/unlock`,
    { password }
  ).pipe(
    map(note => this.normalizeNote(note))
  );
}

lockNote(noteId: number, password: string): Observable<Note> {
  return this.http.patch<any>(
    `${this.baseUrl}/api/notes/${noteId}/password`,
    { password }
  ).pipe(
    map(updatedNote => {
      this.normalizeNote(updatedNote);
      const current = this.notes();
      const idx = current.findIndex(n => n.id === updatedNote.id);
      if (idx > -1) {
        current[idx] = this.normalizeNote(updatedNote);
        this.notes.set([...current]);
      }
      return this.normalizeNote(updatedNote);
  })
  );
}

unlockNote(noteId: number, password: string): Observable<Note> {
  return this.http.delete<any>(
    `${this.baseUrl}/api/notes/${noteId}/password`,
    { body: { password } }
  ).pipe(
    map(updatedNote => {
      this.normalizeNote(updatedNote);
      const current = this.notes();
      const idx = current.findIndex(n => n.id === updatedNote.id);
      if (idx > -1) {
        current[idx] = this.normalizeNote(updatedNote);
        this.notes.set([...current]);
      }
      return this.normalizeNote(updatedNote);
  })
  );
}
}
