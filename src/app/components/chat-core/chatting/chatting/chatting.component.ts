import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PageSizeService } from '../../../../services/page-size.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChattingService } from '../../../../services/chat-core/chatting.service';
import { map, Observable, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';
import { ObjectId } from 'mongodb';
import { ChatSocketService } from '../../../../services/chat-core/chat-socket.service';
import { TextareaModule } from 'primeng/textarea';
import { SplitterModule } from 'primeng/splitter';
import { ChattingJobListComponent } from './chatting-job-list/chatting-job-list.component';
import { StoredMessage } from '@langchain/core/messages';
import { MonacoEditorComponent, MonacoEditorOptions } from '../../../monaco-editor/monaco-editor.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ListDetailShellComponent } from '../../../list-detail-shell/list-detail-shell.component';

@Component({
  selector: 'app-chatting',
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    ChatMessageComponent,
    RouterModule,
    TextareaModule,
    SplitterModule,
    ChattingJobListComponent,
    CheckboxModule,
    DialogModule,
    MonacoEditorComponent,
    ListDetailShellComponent,
  ],
  templateUrl: './chatting.component.html',
  styleUrl: './chatting.component.scss',
})
export class ChattingComponent extends ComponentBase {
  constructor(
    readonly chatRoomService: ChatRoomsService,
    readonly chattingService: ChattingService,
    readonly route: ActivatedRoute,
    readonly chatSocketService: ChatSocketService,
    readonly confirmationService: ConfirmationService,
    readonly pageSizeService: PageSizeService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$),
    ).subscribe(params => {
      this.chatRoomService.selectedChatRoomId = params['chatRoomId'];
      this.chatRoomId = params['chatRoomId'];
      this.projectId = params['projectId'];
    });

    this.chatHistory$ = this.chattingService.chatHistory$.pipe(
      takeUntil(this.ngDestroy$),
      map(value => {
        return value?.filter(m => m.type !== 'tool' && ((m.data.content?.length ?? 0) > 0)) ?? [];
      })
    );

    setTimeout(() => {
      if (this.autoScroll) {
        this.scrollChatToBottom();
      }
    }, 500);
  }

  chatHistory$!: Observable<StoredMessage[]>;

  chatRoomId: ObjectId | undefined;
  projectId: ObjectId | undefined;

  chatMessage: string = '';

  sendMessage() {
    // Delegate loading state and cancellation to the service so the job list
    // panel shares the same busy flag and cancel action.
    this.chattingService.sendChatMessage(this.chatMessage).subscribe({
      next: () => {
        if (this.autoScroll) {
          this.scrollChatToBottom();
        }
      },
    });

    this.chatMessage = '';
    this.setMessageInputFocus();
  }

  clearMessages() {
    this.confirmationService.confirm({
      header: `Confirm Clear Messages`,
      message: `Are you sure you wish to clear all chat messages from this chat room?`,
      accept: () => {
        this.chattingService.clearMessages();
        this.setMessageInputFocus();
      },
    });
  }

  messageMonacoEditorOptions: MonacoEditorOptions = {
    currentLanguage: 'plaintext',
    wordWrapOn: true,
  };

  isMonacoEditorVisible = false;

  showMonacoEditor() {
    this.isMonacoEditorVisible = true;
  }

  closeMonacoEditor() {
    this.isMonacoEditorVisible = false;
  }

  autoScroll = true;

  scrollChatToBottom() {
    const historyArea = document.querySelector('.chat-history-area');
    if (historyArea) {
      historyArea.scrollTo({ top: historyArea.scrollHeight, behavior: 'smooth' });
    }
  }

  setMessageInputFocus() {
    const target = document.querySelector('#user-message') as HTMLTextAreaElement;
    target?.focus();
  }
}
