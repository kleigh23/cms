import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../message-model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Help', 'Hey I am struggling could you help me?', 'Me'),
    new Message('2', 'Help', 'Yes I can could we meet at 4pm?', 'Teacher'),
    new Message('3', 'Help', 'That works perfect thank you!', 'Me')
  ];

  onAddMessage(message: Message){
    this.messages.push(message);
  }

}
