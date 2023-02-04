import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Message } from '../message-model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit{
  currentSender = '4';
  @ViewChild('subject', {static: true}) subjectRef: ElementRef;
  @ViewChild('msgText', {static: true}) msgTextRef: ElementRef;

  constructor(private messageService: MessageService) {}

  ngOnInit() {

  }

  onSendMessage() {
    const sub = this.subjectRef.nativeElement.value;
    const msg = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('1', sub, msg, this.currentSender);
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.clear();
    this.msgTextRef.nativeElement.clear();
  }
}
