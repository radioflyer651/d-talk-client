import { Observable } from "rxjs";
import { IChatDocumentData } from "../../../../model/shared-models/chat-core/documents/chat-document.model";
import { ChatDocumentWrapperBase } from "../../../../model/chat-documents/chat-document-base.wrapper";


/** Provides support services for specific document types. */
export interface IDocumentSupportService {

    /** The type of document this service supports. */
    readonly documentType: string;

    /** When a new document is created, this method creates a new wrapper for the
     *   document, allowing specialized functionality, if any. */
    registerDocument(document: IChatDocumentData, destroyer$: Observable<void>): Promise<ChatDocumentWrapperBase<any>>;

}