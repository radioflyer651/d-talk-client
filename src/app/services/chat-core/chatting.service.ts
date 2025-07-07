import { Injectable } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ChatRoomsService } from './chat-rooms.service';
import { lastValueFrom, map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { StoredMessage } from '@langchain/core/messages';
import { ChatRoomData } from '../../../model/shared-models/chat-core/chat-room-data.model';
import { ChattingApiClientService } from './api-clients/chatting-api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  constructor(
    readonly projectService: ProjectsService,
    readonly chatRoomService: ChatRoomsService,
    readonly chattingApiClient: ChattingApiClientService,
  ) {
    this.initialize();
  }

  private _refreshChatHistory$ = new Subject<void>();

  initialize() {
    this.chatHistory$ = this.chatRoomService.selectedChatRoom$.pipe(
      tap(room => {
        this.chatRoom = room;
      }),
      switchMap(room => {
        return this._refreshChatHistory$.pipe(
          startWith(undefined),
          map(() => {
            return room?.conversation ?? [];
          })
        );
      })
    );
  }

  chatRoom: ChatRoomData | undefined;

  chatHistory$!: Observable<StoredMessage[]>;

  async sendChatMessage(message: string): Promise<void> {
    if (!this.chatRoom) {
      throw new Error(`No chat room is selected.`);
    }

    // Make the API call, and get the response.
    const response = await lastValueFrom(this.chattingApiClient.sendChatMessage(this.chatRoom._id, message));

    // Add the response to the chat history.
    this.chatRoom.conversation.push(...response);
    this._refreshChatHistory$.next();
  }

  async clearMessages() {
    if (!this.chatRoom) {
      throw new Error(`There is no current chat room.`);
    }

    await lastValueFrom(this.chattingApiClient.clearChatRoomConversation(this.chatRoom._id));
    this.chatRoomService.reloadSelectedChatRoom();
  }
}
