import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { MessagePositionTypes, PositionableMessage } from '../../../../../model/shared-models/chat-core/positionable-message.model';
import { StoredMessage } from '@langchain/core/messages';
import { PositionableMessageDetailComponent } from "../positionable-message-detail/positionable-message-detail.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { createStoredMessage } from '../../../../../utils/create-stored-message.utils';

@Component({
  selector: 'app-positionable-message-list',
  imports: [
    PositionableMessageDetailComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './positionable-message-list.component.html',
  styleUrl: './positionable-message-list.component.scss'
})
export class PositionableMessageListComponent extends ComponentBase {
  constructor() {
    super();
  }


  /** Gets or sets the set of messages currently being edited. */
  @Input({ required: true })
  messages!: PositionableMessage<StoredMessage>[];

  addMessage() {
    // Create a new message, and add it to the list.
    const newMessage = createStoredMessage();
    const newPositionableMessage: PositionableMessage<StoredMessage> = {
      location: MessagePositionTypes.Last,
      message: newMessage,
      offset: 0
    };

    this.messages.push(newPositionableMessage);
  }

}
