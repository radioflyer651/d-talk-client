import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../../token.service';
import { ClientApiServiceBase } from './api-client-base.service';
import { ObjectId } from 'mongodb';
import { StoredMessage } from '@langchain/core/messages';

@Injectable({
  providedIn: 'root'
})
export class ChattingApiClientService extends ClientApiServiceBase {
  constructor(
    http: HttpClient,
    tokenService: TokenService,
  ) {
    super(http, tokenService);
  }

  sendChatMessage(roomId: ObjectId, message: string) {
    return this.http.post<StoredMessage[]>(this.constructUrl(`chat-room/${roomId}/message`),
      { message },
      this.optionsBuilder.withAuthorization());
  }

  clearChatRoomConversation(roomId: ObjectId) {
    return this.http.put(this.constructUrl(`chat-room/${roomId}/conversation/clear`),
      undefined,
      this.optionsBuilder.withAuthorization());
  }

  /**
   * Updates a chat message in a chat room.
   * @param roomId The chat room ID
   * @param messageId The message ID
   * @param newContent The new content for the message
   */
  updateChatMessageInChatRoom(roomId: ObjectId, messageId: string, newContent: string) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/message/${messageId}`),
      { newContent },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes a chat message in a chat room.
   * @param roomId The chat room ID
   * @param messageId The message ID
   */
  deleteChatMessageInChatRoom(roomId: ObjectId, messageId: string) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/message/${messageId}`),
      this.optionsBuilder.withAuthorization()
    );
  }
}
