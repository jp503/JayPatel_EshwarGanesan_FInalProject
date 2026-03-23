import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NoteListComponent } from './note-list/note-list.component';
import { Note } from './note';
import { CommonModule } from '@angular/common';
import { NoteServiceService } from './note-service.service';
import { TagServiceService } from './tag-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, NoteListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'note-taking-app';
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  tags: string[] = [];

  constructor(private noteService: NoteServiceService, private tagService: TagServiceService) {}

  ngOnInit(): void {
    this.tagService.getAllTags().subscribe({
      next: (t) => this.tags = t,
      error: (err) => console.error('Failed to load tags', err)
    });
    this.noteService.getAllNotes().subscribe({
      next: (n) => {
        this.notes = n;
        this.filteredNotes = n;
      },
      error: (err) => console.error('Failed to load notes', err)
    });
  }

  onSearch(text: string) {
    const q = (text || '').toLowerCase().trim();
    if (!q) {
      this.filteredNotes = this.notes;
      return;
    }
    this.filteredNotes = this.notes.filter(n => JSON.stringify(n).toLowerCase().includes(q));
  }
}
