import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = []
  documentId: string;
  subscription: Subscription;

  constructor(private documentService: DocumentService) {
  }

  ngOnInit() {
    this.documentService.getDocuments();
    this.subscription = this.documentService.documentListChangedEvent
    .subscribe((documents: Document[]) => {
      this.documents = documents;
    })
  }

  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
