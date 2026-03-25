import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class TagServiceService {

  private tags = signal<Tag[]>([]);

  public readonly allTags = this.tags;

  private baseUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) { 
    this.loadTags();
  }

  getAllTags(): Observable<Tag[]> {
  return this.http.get<Tag[]>(`${this.baseUrl}/api/tags`).pipe(
    map(tags => tags.map(t => ({ id: t.id, name: t.name , notes: t.notes || [] })))
  );
}
  loadTags(): void {
    this.getAllTags().subscribe({
      next: (t) => this.tags.set(t),
      error: (err) => console.error('Failed to load tags', err)
    });
  } 

  createTag(name: string): Observable<Tag> {
    return this.http
    .post<Tag>(`${this.baseUrl}/api/tags`, { name })
    .pipe(
      map(createdTag => {
        const current = this.tags();
        this.tags.set([createdTag, ...current]);
        return createdTag;
      })
    );
  }

  updateTag(id: number, newName: string): Observable<Tag> {
  return this.http
    .put<Tag>(`${this.baseUrl}/api/tags/${id}`, { name: newName })
    .pipe(
      map(updatedTag => {
        const current = this.tags();
        const index = current.findIndex(t => t.id === id);

        if (index > -1) {
          current[index] = updatedTag;
          this.tags.set([...current]);
        }

        return updatedTag;
      })
    );
}

  deleteTag(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/api/tags/${id}`).pipe(
    map(() => {
      const current = this.tags();
      this.tags.set(current.filter(t => t.id !== id));
    })
  );
}
  
}
