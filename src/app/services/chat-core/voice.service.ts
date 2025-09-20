import { Injectable } from '@angular/core';
import { ClientApiService, HumeVoiceType } from './api-clients/api-client.service';
import { lastValueFrom } from 'rxjs';
import { StoredMessage } from '@langchain/core/messages';
import { ObjectId } from 'mongodb';
import { getMessageId, getMessageVoiceUrl } from '../../../model/shared-models/chat-core/utils/messages.utils';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  /**
   * Injects the ClientApiService for API calls.
   */
  constructor(private apiClient: ClientApiService) { }

  /**
   * Gets the list of available voices from the Hume voice chat service.
   * @param voiceType The type of voice to fetch ('HUME_AI' or 'CUSTOM_VOICE')
   * @returns Observable<{ voices: ReturnVoice[] }>
   */
  getHumeVoices(voiceType: HumeVoiceType) {
    return this.apiClient.getHumeVoices(voiceType);
  }

  /**
   * Requests a voice message URL for a given message in a chat room.
   * @param chatRoomId The chat room ID
   * @param messageId The message ID
   * @returns Observable<{ url: string }>
   */
  protected requestVoiceMessage(chatRoomId: ObjectId, messageId: ObjectId) {
    return this.apiClient.requestVoiceMessage(chatRoomId, messageId);
  }

  async getVoiceUrl(chatRoomId: ObjectId, message: StoredMessage): Promise<string | undefined> {
    // Try to get the result from the message itself, and return that.
    const staticUrl = getMessageVoiceUrl(message);
    if (staticUrl) {
      return staticUrl;
    }

    // Get the ID from the message.  If we don't have one, then we can't do much.
    const messageId = getMessageId(message);
    if (!messageId) {
      throw new Error(`Message does not have an ID.`);
    }

    // Get the value from the server.
    const result = await lastValueFrom(this.requestVoiceMessage(chatRoomId, messageId));

    // Not sure why this wouldn't be set, but let's be careful.
    if (result?.url) {
      return result.url;
    }

    // HAH, (assuming we reached this point), we really DIDN'T have a URL!
    return undefined;
  }
}
