import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteServiceService } from '../note-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private noteService: NoteServiceService) {}
  listView: boolean = false;
  @Output() toggleView = new EventEmitter<boolean>();
  @Output() searchChange = new EventEmitter<string>();

  onSearchChange() {
    this.searchChange.emit(this.query);
  }

  onRefresh() {
    this.noteService.loadNotes();
  }
  
  onToggleView() {
    this.listView = !this.listView;
    this.toggleView.emit(this.listView);
  }
  query = '';
}
