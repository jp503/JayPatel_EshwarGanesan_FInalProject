import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class TagServiceService {

  private tags: Tag[] = [];

  public readonly allTags = this.tags;

  private baseUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) { 
    this.loadTags();
  }

  getAllTags(): Observable<Tag[]> {
  return this.http.get<Tag[]>(`${this.baseUrl}/api/tags`);
}
  loadTags(): void {
    this.getAllTags().subscribe({
      next: (t) => this.tags.splice(0, this.tags.length, ...t),
      error: (err) => console.error('Failed to load tags', err)
    });
  } 

  createTag(name: string): Observable<Tag> {
    return this.http
    .post<Tag>(`${this.baseUrl}/api/tags`, { name })
    .pipe(
      map(createdTag => {
        this.tags.push(createdTag);
        return createdTag;
      })
    );
  }

  updateTag(id: number, newName: string): Observable<Tag> {
  return this.http
    .put<Tag>(`${this.baseUrl}/api/tags/${id}`, { name: newName })
    .pipe(
      map(updatedTag => {
        const index = this.tags.findIndex(t => t.id === id);

        if (index !== -1) {
          this.tags[index] = updatedTag;
        }

        return updatedTag;
      })
    );
}

  deleteTag(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/api/tags/${id}`).pipe(
    map(() => {
      const idx = this.tags.findIndex(t => t.id === id);
      if (idx !== -1) this.tags.splice(idx, 1);
    })
  );
}
  
}
