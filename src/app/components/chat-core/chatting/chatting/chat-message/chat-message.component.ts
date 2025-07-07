import { Component, Input, OnInit } from '@angular/core';
import { StoredMessage } from '@langchain/core/messages';
import { StoredMessageWrapper } from '../../../../../../utils/stored-messae-wrapper.utils';
import { StoredMessageAgentTypes } from '../../../../../../model/stored-message-agent-types.data';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  standalone: true,
  imports: [],
})
export class ChatMessageComponent implements OnInit {
  @Input() message!: StoredMessage;
  wrapper!: StoredMessageWrapper;
  agent!: StoredMessageAgentTypes;

  ngOnInit() {
    this.wrapper = new StoredMessageWrapper(this.message);
    this.agent = this.wrapper.agent;
  }
}
