import { StoredMessage } from "@langchain/core/messages";
import { StoredMessageWrapper } from "../model/shared-models/chat-core/stored-message-wrapper.utils";


export function createStoredMessage(): StoredMessage {
    const result: StoredMessage = {
        type: 'system',
        data: {
            content: '',
            name: undefined,
            role: 'system',
            tool_call_id: undefined,
        }
    };

    return result;
}

/** Returns a new StoredMessageWrapper with a new StoredMessage as a reference. */
export function createStoredMessageWithWrapper(): StoredMessageWrapper {
    const data = createStoredMessage();
    return new StoredMessageWrapper(data);
}