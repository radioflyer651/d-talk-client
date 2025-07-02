import { StoredMessageData } from "@langchain/core/messages";
import { MessageSpeaker, isMessageSpeaker } from "../model/shared-models/chat-core/message-speaker.model";

export const MESSAGE_SPEAKER_KEY = 'dtalk_speaker';

/** Attempts to retrieve the speaker data for a specified message. */
export function getSpeakerFromMessage(message: StoredMessageData): MessageSpeaker | undefined {
    // Get the data dictinoary.
    const args = message.additional_kwargs;

    if (!args) {
        return undefined;
    }

    // Get the item from teh data dictionary.
    const result = args[MESSAGE_SPEAKER_KEY];

    // Validate it.
    if (!isMessageSpeaker(result)) {
        return undefined;
    }

    // Return the result.
    return result;
}

/** Sets the speaker data for a specified message. */
export function setSpeakerOnMessage(message: StoredMessageData, speaker: MessageSpeaker): void {
    if (!message.additional_kwargs) {
        message.additional_kwargs = {};
    }
    message.additional_kwargs[MESSAGE_SPEAKER_KEY] = speaker;
}