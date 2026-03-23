import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagServiceService {

  private tags: string[] = [];

  public readonly allTags = this.tags;

  private baseUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) { }

  getAllTags(): Observable<string[]> {
    return this.http
      .get<{ id: number; name: string; notes: any[] }[]>(`${this.baseUrl}/api/tags`)
      .pipe(map(tags => tags.map(t => t.name)));
  }

  loadTags(): void {
    this.getAllTags().subscribe({
      next: (t) => this.tags = t,
      error: (err) => console.error('Failed to load tags', err)
    });
  } 
  
}
