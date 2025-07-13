
declare module '@langchain/core/messages' {
    export interface StoredMessageData {
        content: string;
        role: string | undefined;
        name: string | undefined;
        tool_call_id: string | undefined;
        tool_calls?: any[];
        additional_kwargs?: Record<string, any>;
        /** Response metadata. For example: response headers, logprobs, token counts. */
        response_metadata?: Record<string, any>;
        id?: string;
    }

    export interface StoredMessage {
        type: string;
        data: StoredMessageData;
    }

    export type BaseMessage = unknown;
}