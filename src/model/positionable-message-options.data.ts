import { MessagePositionTypes } from "./shared-models/chat-core/positionable-message.model";


export const positionableMessageLocationOptions = [
    {
        label: 'Instructions',
        value: MessagePositionTypes.Instructions,
        requiresOffset: false,
    },
    {
        label: 'After Identity',
        value: MessagePositionTypes.AfterAgentIdentity,
        requiresOffset: false,
    },
    {
        label: 'After instructions',
        value: MessagePositionTypes.AfterInstructions,
        requiresOffset: false,
    },
    {
        label: 'Offset From Front',
        value: MessagePositionTypes.OffsetFromFront,
        requiresOffset: true,
    },
    {
        label: 'Offset From End',
        value: MessagePositionTypes.OffsetFromEnd,
        requiresOffset: true,
    },
    {
        label: 'Last',
        value: MessagePositionTypes.Last,
        requiresOffset: false,
    }
];