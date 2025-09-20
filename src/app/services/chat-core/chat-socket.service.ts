import { Injectable } from '@angular/core';
import { SocketService } from '../socket.service';
import { MESSAGE_CHUNK_MESSAGE, MessageChunkMessage } from '../../../model/shared-models/chat-core/socket-messaging/message-chunk-message.socket-model';
import { ChatRoomsService } from './chat-rooms.service';
import { EMPTY, filter, map, startWith, Subscription, switchMap } from 'rxjs';
import { createStoredMessage } from '../../../utils/create-stored-message.utils';
import { StoredMessageWrapper } from '../../../model/shared-models/chat-core/stored-message-wrapper.utils';
import { ObjectId } from 'mongodb';
import { ENTER_CHAT_ROOM, EnterChatRoomMessage, EXIT_CHAT_ROOM, ExitChatRoomMessage } from '../../../model/shared-models/chat-core/socket-messaging/general-messaging.socket-model';
import { ChattingService } from './chatting.service';
import { ChatMessageUpdatedMessage, MESSAGE_UPDATED_MESSAGE } from '../../../model/shared-models/chat-core/socket-messaging/chat-message-updated-message.socket-model';
import { getMessageId } from '../../../model/shared-models/chat-core/utils/messages.utils';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  constructor(
    readonly socketService: SocketService,
    readonly chatRoomService: ChatRoomsService,
    readonly chattingService: ChattingService,
  ) {
    this.initialize();
  }

  protected joinChatRoom(roomId: ObjectId) {
    this.socketService.sendMessage(ENTER_CHAT_ROOM, <EnterChatRoomMessage>{ roomId: roomId });
  }

  protected leaveChatRoom(roomId: ObjectId) {
    this.socketService.sendMessage(EXIT_CHAT_ROOM, <ExitChatRoomMessage>{ roomId: roomId });
  }

  initialize() {
    // Subscription 1: Handle joining/leaving rooms.
    let previousRoomId: ObjectId | null = null;

    const connectedRoom$ = this.socketService.reconnected$.pipe(
      startWith(undefined),
      switchMap(() => {
        return this.chatRoomService.selectedChatRoom$;
      })
    );

    let rejoinSubscription: Subscription | undefined;
    connectedRoom$.subscribe({
      next: room => {
        if (previousRoomId && (!room || previousRoomId !== room._id)) {
          this.leaveChatRoom(previousRoomId);
        }
        rejoinSubscription?.unsubscribe();

        if (room && previousRoomId !== room._id) {
          this.joinChatRoom(room._id);
          previousRoomId = room._id;
          rejoinSubscription = this.socketService.subscribeToReconnect()
            .subscribe(() => {
              this.joinChatRoom(room._id);
            });
        }

        if (!room) {
          previousRoomId = null;
          rejoinSubscription = undefined;
        }
      },
      complete: () => {

      }
    });

    // Subscription 2: Handle incoming messages for the selected room.
    connectedRoom$.pipe(
      switchMap(room => {
        // If there's no room, then there's nothing to do here.
        if (!room) {
          return EMPTY;
        }

        // Emit the room and the event/chunk with any changes.
        return this.socketService.subscribeToSocketEvent(MESSAGE_CHUNK_MESSAGE).pipe(
          filter(ev => (ev.args[0] as MessageChunkMessage).chatRoomId === room._id),
          map(ev => ({ event: ev, room }))
        );
      })
    ).subscribe(eventArgs => {
      // NOTE: We already know the room is right from the filter above.
      const room = eventArgs.room;

      // Get the args as the right event type.
      const args = eventArgs.event.args[0] as MessageChunkMessage;

      // Find the message in the conversation.
      let message = room.conversation.find(m => m.data.id === args.messageId);

      // If we don't have one, then we need to create one for now.
      if (!message) {
        message = createStoredMessage();
        message.data.id = args.messageId;
        room.conversation.push(message);
      }

      // Create a wrapper to work with this data, and set the values.
      const wrapper = new StoredMessageWrapper(message);
      wrapper.agent = 'ai';
      wrapper.content += args.chunk;
      wrapper.agentId = args.speakerId;
      wrapper.name = args.speakerName;

      this.chattingService.refreshChatHistory();
    });

    // Subscription 3: Handle updates to messages.
    connectedRoom$.pipe(
      switchMap(room => {
        // If there's no room, then there's nothing to do here.
        if (!room) {
          return EMPTY;
        }

        // Emit the room and the event/chunk with any changes.
        return this.socketService.subscribeToSocketEvent(MESSAGE_UPDATED_MESSAGE).pipe(
          filter(ev => (ev.args[0] as ChatMessageUpdatedMessage).chatRoomId === room._id),
          map(ev => ({ eventArgs: ev.args[0] as ChatMessageUpdatedMessage, room }))
        );
      })
    ).subscribe(({ eventArgs, room }) => {
      // Get the ID of the message we're looking for.
      const messageId = getMessageId(eventArgs.message);

      // Check for the message within the room.
      const messageIndex = room.conversation.findIndex(m => getMessageId(m) === messageId);

      // If not found, then exit.
      if (messageIndex < 0) {
        return;
      }

      // Update the message with the new one.
      room.conversation.splice(messageIndex, 1, eventArgs.message);
    });


  }
}
