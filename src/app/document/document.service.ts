import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<Document[]>('https://cms-semester-project-default-rtdb.firebaseio.com/documents.json')
    .subscribe(
      // success method
      (documents: Document[]) => {
         this.documents = documents
         this.maxDocumentId = this.getMaxId();
         this.documents.sort();
         this.documentListChangedEvent.next(this.documents.slice());
      },
      // error method
      (error: any) => {
         console.log(error);
      } 
    )
  }

  storeDocuments(documents: Document){
    const documentString = JSON.stringify(this.documents);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.getDocuments();
    this.http
    .put('https://cms-semester-project-default-rtdb.firebaseio.com/documents.json', documentString, { headers })
    .subscribe(
      (response) => {
        this.documentListChangedEvent.next(this.documents.slice()), response;
      },
      (error) => {
        console.log('Error saving documents: ', error);
      }
    );
  }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null!;
  }

//   deleteDocument(document: Document) {
//     if (!document) {
//        return;
//     }
//     const pos = this.documents.indexOf(document);
//     if (pos < 0) {
//        return;
//     }
//     this.documents.splice(pos, 1);
//     this.documentChangedEvent.emit(this.documents.slice());
//  }

 
  getMaxId(): number {

    let maxId = 0

    for (let document of this.documents) {
      let id = +document.id;
      if (id > maxId) {
      maxId = id;
      }
    }
    return maxId
  }

  
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(newDocument);
    }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      console.log('null document');
        return
    }
    let pos = this.documents.indexOf(originalDocument);
    console.log(pos);
    if (pos < 0) {
      console.log(pos);
        return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentListClone);
    this.storeDocuments(newDocument);
  }

  deleteDocument(document: Document) {
    if (!document) {
        return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
        return;
    }
    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(document);
}

}
