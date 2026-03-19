import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'note-taking-app';
  notes = [] as any[];
  filteredNotes = this.notes;

  onSearch(text: string) {
    const q = (text || '').toLowerCase().trim();
    if (!q) {
      this.filteredNotes = this.notes;
      return;
    }
    this.filteredNotes = this.notes.filter(n => JSON.stringify(n).toLowerCase().includes(q));
  }
}
