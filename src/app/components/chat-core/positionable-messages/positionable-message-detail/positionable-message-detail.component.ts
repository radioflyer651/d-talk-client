import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { ComponentBase } from '../../../component-base/component-base.component';
import { PositionableMessage } from '../../../../../model/shared-models/chat-core/positionable-message.model';
import { StoredMessage } from '@langchain/core/messages';
import { StoredMessageWrapper } from '../../../../../model/shared-models/chat-core/stored-messae-wrapper.utils';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { storedMessageAgentTypeOptions } from '../../../../../model/shared-models/chat-core/stored-message-agent-types.data';
import { positionableMessageLocationOptions } from '../../../../../model/positionable-message-options.data';

@Component({
  selector: 'app-positionable-message-detail',
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    InputTextModule,
    SelectModule,
    CardModule,
    ButtonModule,
    PanelModule,
    FloatLabelModule,
    InputNumberModule,
  ],
  templateUrl: './positionable-message-detail.component.html',
  styleUrl: './positionable-message-detail.component.scss'
})
export class PositionableMessageDetailComponent extends ComponentBase {
  constructor() {
    super();
  }

  private _message!: PositionableMessage<StoredMessage>;
  @Input({ required: true })
  get message(): PositionableMessage<StoredMessage> {
    return this._message;
  }
  set message(value: PositionableMessage<StoredMessage>) {
    this._message = value;

    if (value) {
      this.messageController = new StoredMessageWrapper(value.message);
    } else {
      this.messageController = undefined;
    }
  }

  /** Options for the agent type in the select box. */
  agentTypeOptions = storedMessageAgentTypeOptions;

  /** Options for selecting the position type. */
  positioningTypeOptions = positionableMessageLocationOptions;

  @Input({ required: true })
  messageIndex!: number;

  get showOffset(): boolean {
    const option = this.positioningTypeOptions.find(o => o.value === this.message.location);
    return option?.requiresOffset ?? false;
  }

  messageController?: StoredMessageWrapper;

  @Output()
  deleteClicked = new EventEmitter<number>();

  onDeleteClicked() {
    this.deleteClicked.emit(this.messageIndex);
  }
}
