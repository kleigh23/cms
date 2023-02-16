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

  constructor(private documentServices: DocumentService) {
  }

  ngOnInit() {
    this.documents = this.documentServices.getDocuments();
    // this.documentServices.documentChangedEvent.subscribe(
    //   (documents: Document[]) => {
    //      this.documents = documents;
    // })
    this.subscription = this.documentServices.documentListChangedEvent
    .subscribe(
      (documents: Document[]) => {
        this.documents = documents;
      }
    )
  }

  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
