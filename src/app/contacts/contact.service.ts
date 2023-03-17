import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private http: HttpClient) { 
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    // return this.contacts.slice();
    this.http.get<Contact[]>('http://localhost:3000/contacts')
    .subscribe(
      //success method
      (contacts: Contact[]) => {
        this.contacts = contacts
        this.maxContactId = this.getMaxId();
        this.contacts.sort();
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  storeContacts(contacts: Contact) {
    const contactString = JSON.stringify(this.contacts);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.getContacts();
    this.http
    .put('https://cms-semester-project-default-rtdb.firebaseio.com/contacts.json', contactString, { headers })
    .subscribe(
      (response) => {
        this.contactListChangedEvent.next(this.contacts.slice()), response;
      },
      (error) => {
        console.log('Error saving contacts: ', error);
      }
    );
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      } 
    }
    return null!;
  }

  // deleteContact(contact: Contact) {
  //   if (!contact) {
  //     return;
  //   }
  //   const pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   this.contactChangedEvent.emit(this.contacts.slice());
  // }

  getMaxId(): number {
    let maxId = 0

    for (let contact of this.contacts) {
      let id = +contact.id;
      if (id > maxId) {
        maxId = id
      }
    }
    return maxId
  }

  // addContact(newContact: Contact) {
  //   if (!newContact) {
  //     return;
  //   }
  //   this.maxContactId++;
  //   newContact.id = this.maxContactId.toString();
  //   this.contacts.push(newContact);
  //   let contactListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactListClone);
  //   this.storeContacts(newContact);
  // }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Document is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  // updateContact(originalContact: Contact, newContact: Contact) {
  //   if (!originalContact || !newContact) {
  //     return
  //   }
  //   let pos = this.contacts.indexOf(originalContact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   newContact.id = originalContact.id;
  //   this.contacts[pos] = newContact;
  //   let contactsListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactsListClone);
  //   this.storeContacts(newContact);
  // }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newContact.id = originalContact.id;
    // newContact._id = originalContact._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (contacts) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }

  // deleteContact(contact: Contact) {
  //   if (!contact) {
  //     return;
  //   }
  //   const pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   let contactListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactListClone);
  //   this.storeContacts(contact);
  // }

  deleteContact(contact: Contact) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (contacts) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  sortAndSend(){
    this.contacts.sort((a,b)=>{
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice())
  }

}