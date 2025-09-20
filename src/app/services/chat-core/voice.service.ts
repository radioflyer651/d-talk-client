import { Injectable } from '@angular/core';
import { ClientApiService, HumeVoiceType } from './api-clients/api-client.service';

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
  requestVoiceMessage(chatRoomId: string, messageId: string) {
    return this.apiClient.requestVoiceMessage(chatRoomId, messageId);
  }
}
