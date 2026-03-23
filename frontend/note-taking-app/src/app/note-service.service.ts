import { Injectable, signal, computed } from '@angular/core';
import { Note } from './note';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.get<Note[]>(`${this.baseUrl}/api/notes`);
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
}
