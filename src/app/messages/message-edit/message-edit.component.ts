import { Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Message } from '../message-model';
import { outputAst } from '@angular/compiler';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  currentSender = 'Kelley';
  @ViewChild('subject', {static: false}) subjectRef: ElementRef;
  @ViewChild('msgText', {static: false}) msgTextRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  onSendMessage() {
    const sub = this.subjectRef.nativeElement.value;
    const msg = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('1', sub, msg, this.currentSender);
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    const sub = this.subjectRef.nativeElement = 'Write message';
    const msg = this.msgTextRef.nativeElement = 'Write message';
  }
}
