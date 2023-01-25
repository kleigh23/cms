import { Component, Output, EventEmitter } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document('1', 'Bungie', 'Website sharing about their games.', 'https://www.bungie.net/7', 'children'),
    new Document('2', 'Church of Jesus Christ', 'Website sharing the gospel', 'https://www.churchofjesuschrist.org/?lang=eng', 'children'),
    new Document('3', 'Google', 'Search engine', 'google.com', 'children'),
    new Document('4', 'IMDB', 'Website that has all the movie information you need.', 'https://www.imdb.com/', 'children'),
  ]

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
