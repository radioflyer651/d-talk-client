import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PageSizeService } from '../../../../services/page-size.service';
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChattingService } from '../../../../services/chat-core/chatting.service';
import { map, Observable, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';
import { ObjectId } from 'mongodb';
import { ChatSocketService } from '../../../../services/chat-core/chat-socket.service';
import { TextareaModule } from 'primeng/textarea';
import { SplitterModule } from 'primeng/splitter';
import { ChattingJobListComponent } from "./chatting-job-list/chatting-job-list.component";
import { StoredMessage } from '@langchain/core/messages';
import { MonacoEditorOptions } from "../../../monaco-editor/monaco-editor.component";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmationService } from 'primeng/api';

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
    DrawerModule
  ],
  templateUrl: './chatting.component.html',
  styleUrl: './chatting.component.scss'
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
  private _showDrawer: boolean = false;
  public get showDrawer(): boolean {
    if (!this.pageSizeService.isSkinnyPage) {
      return false;
    }
    return this._showDrawer;
  }
  public set showDrawer(v: boolean) {
    this._showDrawer = v;
  }

  openDrawer() {
    this.showDrawer = true;
  }

  closeDrawer() {
    this.showDrawer = false;
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
        const result = value?.filter(m => m.type !== 'tool' && ((m.data.content?.length ?? 0) > 0)) ?? [];
        // const result = value
        return result;
      })
    );

    setTimeout(() => {
      if (this.autoScroll) {
        this.scrollChatToBottom();
      }
    }, 500);

    this.pageSizeService.pageResized$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(newSize => {
      this.secondRowControlButtons = newSize.width <= 600;
    });
  }

  secondRowControlButtons = false;

  chatHistory$!: Observable<StoredMessage[]>;

  chatRoomId: ObjectId | undefined;
  projectId: ObjectId | undefined;

  chatMessage: string = '';

  cancelLlmMessage!: () => void | Promise<void>;
  isLoading = false;

  monacoEditorOptions: MonacoEditorOptions = {
    currentLanguage: 'plaintext',
    wordWrapOn: true,
    showToolbar: false,
  };

  sendMessage() {
    this.isLoading = true;

    const onComplete = () => {
      this.isLoading = false;
      this.cancelLlmMessage = () => undefined;

      if (this.autoScroll) {
        this.scrollChatToBottom();
      }
    };

    let subscription = this.chattingService.sendChatMessage(this.chatMessage).subscribe({
      next: onComplete,
      error: onComplete,
      complete: onComplete
    });

    this.cancelLlmMessage = async () => {
      subscription.unsubscribe();
      setTimeout(async () => {
        await this.chattingService.reloadChatHistory();
        onComplete();
      }, 1000);
    };

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
      }
    });
  }

  autoScroll = true;

  scrollChatToBottom() {
    const historyArea = document.querySelector('.chat-history-area');
    if (historyArea) {
      historyArea.scrollTo({
        top: historyArea.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  setMessageInputFocus() {
    const target = document.querySelector('#user-message') as HTMLTextAreaElement;
    target.focus();
  }
}
