import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Document } from '../document.model'

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent {
  @Input() document: Document;
  @Output() documentSelected = new EventEmitter<void>();

  onSelected() {
    this.documentSelected.emit();
  }

}
