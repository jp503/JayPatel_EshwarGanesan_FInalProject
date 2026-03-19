import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NoteListComponent } from './note-list/note-list.component';
import { placeholderNotes } from './placeholder-notes';
import { Note } from './note';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, NoteListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'note-taking-app';
  notes: Note[] = placeholderNotes;
  filteredNotes: Note[] = this.notes;

  onSearch(text: string) {
    const q = (text || '').toLowerCase().trim();
    if (!q) {
      this.filteredNotes = this.notes;
      return;
    }
    this.filteredNotes = this.notes.filter(n => JSON.stringify(n).toLowerCase().includes(q));
  }
}
