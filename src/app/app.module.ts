import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { DndModule } from 'ng2-dnd';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { ContactItemComponent } from './contacts/contact-item/contact-item.component';
import { DocumentComponent } from './document/document.component';
import { DocumentListComponent } from './document/document-list/document-list.component';
import { DocumentItemComponent } from './document/document-item/document-item.component';
import { DocumentDetailComponent } from './document/document-detail/document-detail.component';
import { MessageItemComponent } from './messages/message-item/message-item.component';
import { MessageEditComponent } from './messages/message-edit/message-edit.component';
import { MessageListComponent } from './messages/message-list/message-list.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { MessageService } from './messages/message.service';
import { DocumentEditComponent } from './document/document-edit/document-edit.component';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component';
import { DocumentService } from './document/document.service';
import { ContactService } from './contacts/contact.service';
import { ContactsFilterPipe } from './contacts/contacts-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContactsComponent,
    ContactListComponent,
    ContactDetailComponent,
    ContactItemComponent,
    DocumentComponent,
    DocumentListComponent,
    DocumentItemComponent,
    DocumentDetailComponent,
    MessageItemComponent,
    MessageEditComponent,
    MessageListComponent,
    DropdownDirective,
    DocumentEditComponent,
    ContactEditComponent,
    ContactsFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DndModule.forRoot()
  ],
  providers: [MessageService, DocumentService, ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
