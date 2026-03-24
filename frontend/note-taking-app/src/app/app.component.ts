import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NoteListComponent } from './note-list/note-list.component';
import { Note } from './note';
import { CommonModule } from '@angular/common';
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
  tags: string[] = [];
  searchQuery: string = '';

  constructor(private tagService: TagServiceService) {}

  ngOnInit(): void {
    this.tagService.getAllTags().subscribe({
      next: (t) => this.tags = t,
      error: (err) => console.error('Failed to load tags', err)
    });
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
  }

}
