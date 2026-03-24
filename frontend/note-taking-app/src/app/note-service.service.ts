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

  public readonly allNotes = this.notes.asReadonly();
  private baseUrl = 'http://localhost:8080'; // adjust port/path as needed

  constructor(private http: HttpClient) { }

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
          notes.map(n => ({
            ...n,
            tags: n.tags ? n.tags.map(t => t.name) : []
          } as unknown as Note))
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
        const current = this.notes();
        const idx = current.findIndex(n => n.id === updatedNote.id);
        if (idx > -1) {
          current[idx] = updatedNote;
          this.notes.set([...current]);
        }
        return updatedNote;
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
        const current = this.notes();
        const idx = current.findIndex(n => n.id === updatedNote.id);
        if (idx > -1) {
          current[idx] = updatedNote;
          this.notes.set([...current]);
        }
        return updatedNote;
      })
    );
  }
}
