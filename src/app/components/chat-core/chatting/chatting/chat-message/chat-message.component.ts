import { Component, Input, OnInit } from '@angular/core';
import { StoredMessage } from '@langchain/core/messages';
import { StoredMessageWrapper } from '../../../../../../model/shared-models/chat-core/stored-message-wrapper.utils';
import { StoredMessageAgentTypes } from '../../../../../../model/shared-models/chat-core/stored-message-agent-types.data';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ChattingService } from '../../../../../services/chat-core/chatting.service';
import { ButtonModule } from 'primeng/button';
import { combineLatestWith, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { AgentInstanceConfiguration } from '../../../../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { AgentInstanceService } from '../../../../../services/chat-core/agent-instance.service';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { MonacoEditorComponent, MonacoEditorOptions } from "../../../../monaco-editor/monaco-editor.component";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    TextareaModule,
    MonacoEditorComponent
  ],
})
export class ChatMessageComponent extends ComponentBase {
  constructor(
    readonly sanitizer: DomSanitizer,
    readonly chattingService: ChattingService,
    readonly agentsService: AgentInstanceService,
    readonly confirmationService: ConfirmationService,
  ) {
    super();

  }

  private _message!: StoredMessage;
  private _agentId$ = new Subject<string | undefined>();

  ngOnInit() {
    this._agentId$.pipe(
      combineLatestWith(this.agentsService.agentInstances$),
      map(([agentId, agents]) => {
        if (!agentId) {
          return undefined;
        }

        return agents.find(a => a._id === agentId);
      }),
      takeUntil(this.ngDestroy$),
    ).subscribe(agent => {
      if (agent) {
        this._name = agent?.name;
      } else {
        this._name = '';
      }
    });
  }

  @Input()
  get message(): StoredMessage {
    return this._message;
  }

  set message(value: StoredMessage) {
    this._message = value;

    if (!value) {
      this.wrapper = undefined;
      this._agentId$.next(undefined);
    } else {
      this.wrapper = new StoredMessageWrapper(value);
      this._agentId$.next(this.wrapper.id);
    }
  }

  private _name: string | undefined;
  get name(): string {
    if (this._name) {
      return this._name;
    }

    if (!this.wrapper) {
      return '';
    }

    const wrapperName = this.wrapper.name?.trim();
    if (wrapperName) {
      this._name = wrapperName;
      return wrapperName;
    }

    const agent = this.chattingService.getAgentInstance(this.wrapper.id);
    if (agent) {
      this._name = agent.name;
      return this._name ?? '';
    }

    return '';
  }

  wrapper: StoredMessageWrapper | undefined;

  monacoEditorOptions: MonacoEditorOptions = {
    currentLanguage: 'plaintext',
    wordWrapOn: true
  };

  get innerHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.message.data.content.replaceAll(/\n/g, '<br/>').replaceAll('\t', '&nbsp;'.repeat(5)));
  }

  isEditDialogVisible = false;
  editMessageContent = '';

  editMessage(): void {
    this.isEditDialogVisible = true;
    this.editMessageContent = this.wrapper!.content;
  }

  async onMessageEditClosed(cancelled: boolean) {
    this.isEditDialogVisible = false;
    if (!cancelled) {
      this.wrapper!.content = this.editMessageContent;
      await this.chattingService.updateChatMessageInChatRoom(this.wrapper!.id, this.wrapper!.content);
    }
  }

  deleteMessage() {
    this.confirmationService.confirm({
      header: 'Confirm Message Deletion',
      message: 'Are you sure you wish to delete this message?',
      accept: () => this.chattingService.deleteChatMessageInChatRoom(this.wrapper!.id)
    });
  }

  copyMessageContent() {
    if (this.wrapper) {
      const content = this.wrapper.content;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    }
  }
}
