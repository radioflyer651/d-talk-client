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
}
