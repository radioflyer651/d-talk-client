import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoredMessage } from '@langchain/core/messages';
import { ButtonModule } from 'primeng/button';
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChattingService } from '../../../../services/chat-core/chatting.service';
import { distinctUntilChanged, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';
import { ObjectId } from 'mongodb';

@Component({
  selector: 'app-chatting',
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    ChatMessageComponent,
    RouterModule,
  ],
  templateUrl: './chatting.component.html',
  styleUrl: './chatting.component.scss'
})
export class ChattingComponent extends ComponentBase {
  constructor(
    readonly chatRoomService: ChatRoomsService,
    readonly chattingService: ChattingService,
    readonly route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$),
    ).subscribe(params => {
      this.chatRoomService.selectedChatRoomId = params['chatRoomId'];
      this.projectId = params['projectId'];
      this.chatRoomId = params['chatRoomId'];
    });
  }

  chatRoomId: ObjectId | undefined;
  projectId: ObjectId | undefined;

  chatMessage: string = '';

  sendMessage() {
    this.chattingService.sendChatMessage(this.chatMessage);
    this.chatMessage = '';
  }

  clearMessages() {
    this.chattingService.clearMessages();
  }
}
