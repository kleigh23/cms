import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message-model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesChanged = new EventEmitter<Message[]>();
  private messages: Message[];

  constructor() { 
    this.messages = MOCKMESSAGES;
  }

  getMessages() {
    return this.messages.slice();
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
    this.messagesChanged.emit(this.messages.slice());
  }
}
