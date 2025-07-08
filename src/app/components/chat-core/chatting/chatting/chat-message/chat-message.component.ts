import { Component, Input, OnInit } from '@angular/core';
import { StoredMessage } from '@langchain/core/messages';
import { StoredMessageWrapper } from '../../../../../../model/shared-models/chat-core/stored-messae-wrapper.utils';
import { StoredMessageAgentTypes } from '../../../../../../model/shared-models/chat-core/stored-message-agent-types.data';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class ChatMessageComponent {
  constructor(
    readonly sanitizer: DomSanitizer,
  ) {

  }

  private _message!: StoredMessage;

  @Input()
  get message(): StoredMessage {
    return this._message;
  }

  set message(value: StoredMessage) {
    this._message = value;

    if (!value) {
      this.wrapper = undefined;
    } else {
      this.wrapper = new StoredMessageWrapper(value);
    }
  }

  wrapper: StoredMessageWrapper | undefined;

  get innerHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.message.data.content.replaceAll(/\n/g, '\n'));
  }
}
