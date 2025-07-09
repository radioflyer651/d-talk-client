import { Injectable } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ChatRoomsService } from './chat-rooms.service';
import { lastValueFrom, map, Observable, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';
import { StoredMessage } from '@langchain/core/messages';
import { ChatRoomData } from '../../../model/shared-models/chat-core/chat-room-data.model';
import { ChattingApiClientService } from './api-clients/chatting-api-client.service';
import { AgentInstanceService } from './agent-instance.service';

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
  private _reloadChatHistory$ = new Subject<void>();

  initialize() {
    let switchRoom: ChatRoomData | undefined;
    let chatRoom: ChatRoomData | undefined;

    this.chatHistory$ = this._reloadChatHistory$.pipe(
      startWith(undefined),
      switchMap(() => {
        return this.chatRoomService.selectedChatRoom$.pipe(
          tap(room => {
            this.chatRoom = room;
            chatRoom = room;
          }),
          switchMap(room => {
            return this._refreshChatHistory$.pipe(
              startWith(undefined),
              map(() => {
                return room?.conversation ?? [];
              })
            );
          }),
        );
      })
    );
  }

  chatRoom: ChatRoomData | undefined;

  chatHistory$!: Observable<StoredMessage[]>;

  sendChatMessage(message: string) {
    if (!this.chatRoom) {
      throw new Error(`No chat room is selected.`);
    }

    // Make the API call, and get the response.
    let response$ = this.chattingApiClient.sendChatMessage(this.chatRoom._id, message);

    let completed = false;

    const onSuccess = (response: StoredMessage[]) => {
      completed = true;
      if (!this.chatRoom) {
        return;
      }

      // Add the response to the chat history.
      if (!this.chatRoom!.conversation) {
        this.chatRoom.conversation = [];
      }

      // If there are any messages in the list with the same IDs, we need to remove them.
      this.chatRoom.conversation = this.chatRoom.conversation.filter(t => !t.data.id || !response.some(r => r.data.id === t.data.id));
      this.chatRoom.conversation.push(...response);
      this._refreshChatHistory$.next();
    };

    const reloadHistory = () => {
      if (!completed) {
        completed = true;
        this.reloadChatHistory();
      }
    };

    response$ = response$.pipe(
      tap({
        next: (response) => onSuccess(response),
        error: () => reloadHistory(),
        complete: () => reloadHistory() // In case of abort.
      })
    );

    return response$;
  }

  async clearMessages() {
    if (!this.chatRoom) {
      throw new Error(`There is no current chat room.`);
    }

    await lastValueFrom(this.chattingApiClient.clearChatRoomConversation(this.chatRoom._id));
    this.chatRoomService.reloadSelectedChatRoom();
  }

  refreshChatHistory() {
    this._refreshChatHistory$.next();
  }

  reloadChatHistory() {
    this._reloadChatHistory$.next();
  }
}
