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
    this.http.get<Document[]>('http://localhost:3000/documents')
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

  
  // addDocument(newDocument: Document) {
  //   if (!newDocument) {
  //     return;
  //   }
  //   this.maxDocumentId++;
  //   newDocument.id = this.maxDocumentId.toString();
  //   this.documents.push(newDocument);
  //   let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments(newDocument);
  //   }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  // updateDocument(originalDocument: Document, newDocument: Document) {
  //   if (!originalDocument || !newDocument) {
  //     console.log('null document');
  //       return
  //   }
  //   let pos = this.documents.indexOf(originalDocument);
  //   console.log(pos);
  //   if (pos < 0) {
  //     console.log(pos);
  //       return;
  //   }
  //   newDocument.id = originalDocument.id;
  //   this.documents[pos] = newDocument;
  //   let documentListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentListClone);
  //   this.storeDocuments(newDocument);
  // }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (documents) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

//   deleteDocument(document: Document) {
//     if (!document) {
//         return;
//     }
//     const pos = this.documents.indexOf(document);
//     if (pos < 0) {
//         return;
//     }
//     this.documents.splice(pos, 1);
//     let documentsListClone = this.documents.slice();
//     // this.documentListChangedEvent.next(documentsListClone);
//     this.storeDocuments(document);
// }

deleteDocument(document: Document) {

  if (!document) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === document.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (documents) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      }
    );
}

sortAndSend(){
  this.documents.sort((a,b)=>{
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  this.documentListChangedEvent.next(this.documents.slice())
}

}
