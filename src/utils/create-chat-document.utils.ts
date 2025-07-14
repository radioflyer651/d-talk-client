import { ObjectId } from "mongodb";
import { ChatDocumentData } from "../model/shared-models/chat-core/chat-document.model";
import { NewDbItem } from "../model/shared-models/db-operation-types.model";

/**
 * Creates a new instance of ChatDocumentData with default values.
 */
export function createDefaultChatDocumentData(projectId: ObjectId, userId: ObjectId,
    folderLocation: string = '', name: string = '',): NewDbItem<ChatDocumentData> {

    return {
        folderLocation,
        projectId,
        createdDate: new Date(),
        updatedDate: new Date(),
        lastChangedBy: { entityType: 'user', id: userId },
        name,
        content: '',
        description: '',
        comments: []
    };
}