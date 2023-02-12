import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = []
  documentId: string;

  constructor(private documentService: DocumentService) {
  }

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
    this.documentService.documentChangedEvent.subscribe((documents: Document[]) => {
         this.documents = documents;
    })
  }


}
