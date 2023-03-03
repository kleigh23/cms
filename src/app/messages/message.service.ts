import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message-model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesChanged = new EventEmitter<Message[]>();
  private messages: Message[];
  maxMessageId: number;

  constructor(private http: HttpClient) { 
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
  }

  getMessages() {
    // return this.messages.slice();
    this.http.get<Message[]>('https://cms-semester-project-default-rtdb.firebaseio.com/messages.json')
    .subscribe(
      // success method
      (messages: Message[]) => {
         this.messages = messages
         this.maxMessageId = this.getMaxId();
         this.messages.sort();
         this.messagesChanged.emit(this.messages.slice());
      },
      // error method
      (error: any) => {
         console.log(error);
      } 
    )
  }

  storeMessages(messages: Message){
    const messageString = JSON.stringify(this.messages);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.getMessages();
    this.http
    .put('https://cms-semester-project-default-rtdb.firebaseio.com/messages.json', messageString, { headers })
    .subscribe(
      (response) => {
        this.messagesChanged.emit(this.messages.slice()), response;
      },
      (error) => {
        console.log('Error saving messages: ', error);
      }
    );
  }  

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id == id) {
        return message;
      }
    }
    return null!;
  }
  
  addMessage(message: Message) {
    this.messages.push(message);
    // this.messagesChanged.emit(this.messages.slice());
    this.storeMessages(message);
  }

  getMaxId(): number {

    let maxId = 0

    for (let message of this.messages) {
      let id = +message.id;
      if (id > maxId) {
      maxId = id;
      }
    }
    return maxId
  }
}
