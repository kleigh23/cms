import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  providers: [DocumentService]
})
export class DocumentComponent implements OnInit {
  selectedDocument: Document;
  documentList: Document[];

  constructor(private documentServices: DocumentService) {}

  ngOnInit() {
    this.documentServices.documentSelectedEvent.subscribe(
      (document: Document) => {
        this.selectedDocument = document;
      }
    )
  }
}
