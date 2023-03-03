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
    this.http.get<Contact[]>('https://cms-semester-project-default-rtdb.firebaseio.com/contacts.json')
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

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactListClone);
    this.storeContacts(newContact);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }
    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts(newContact);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    let contactListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactListClone);
    this.storeContacts(contact);
  }

}