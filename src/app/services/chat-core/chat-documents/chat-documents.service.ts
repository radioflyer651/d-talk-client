import { Inject, Injectable } from '@angular/core';
import { Observable, of, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { ObjectId } from 'mongodb';
import { ClientApiService } from '../api-clients/api-client.service';
import { NewDbItem } from '../../../../model/shared-models/db-operation-types.model';
import { IChatDocumentCreationParams, IChatDocumentData } from '../../../../model/shared-models/chat-core/documents/chat-document.model';
import { DOC_SUPPORT_SERVICES } from './document-support-services.service';
import { IDocumentSupportService } from './document-support-service.interface';
import { ChatDocumentWrapperBase } from '../../../../model/chat-documents/chat-document-base.wrapper';

@Injectable({
  providedIn: 'root'
})
export class ChatDocumentsService {
  constructor(
    private readonly apiClient: ClientApiService,
    @Inject(DOC_SUPPORT_SERVICES) readonly documentSupportServices: IDocumentSupportService[],
  ) {
    this.initialize();
  }

  private _reloadDocuments = new Subject<void>();

  // Observable for document list items for the current project
  documentList$: Observable<IChatDocumentData[]> = this._reloadDocuments.pipe(
    startWith(undefined),
    switchMap(() => {
      if (!this.currentProjectId) return of([]);
      return this.apiClient.getChatDocumentListItemsForProject(this.currentProjectId);
    }),
    shareReplay(1)
  );

  // Observable for full document list for the current project
  documents$: Observable<IChatDocumentData[]> = this._reloadDocuments.pipe(
    startWith(undefined),
    switchMap(() => {
      if (!this.currentProjectId) return of([]);
      return this.apiClient.getChatDocumentsForProject(this.currentProjectId);
    })
  );

  // Current projectId must be set externally
  private _currentProjectId: ObjectId | undefined;
  get currentProjectId(): ObjectId | undefined {
    return this._currentProjectId;
  }
  set currentProjectId(id: ObjectId | undefined) {
    this._currentProjectId = id;
    this.reloadDocuments();
  }

  initialize() {

  }

  // Reload document list
  reloadDocuments() {
    this._reloadDocuments.next();
  }

  // CRUD operations
  createDocument(document: IChatDocumentCreationParams) {
    return this.apiClient.createChatDocument(document).pipe(
      switchMap(result => {
        this.reloadDocuments();
        return of(result);
      })
    );
  }

  updateDocument(update: Partial<IChatDocumentData> & { _id: ObjectId; }) {
    return this.apiClient.updateChatDocument(update).pipe(
      switchMap(result => {
        this.reloadDocuments();
        return of(result);
      })
    );
  }

  deleteDocument(documentId: ObjectId) {
    return this.apiClient.deleteChatDocument(documentId).pipe(
      switchMap(result => {
        this.reloadDocuments();
        return of(result);
      })
    );
  }

  getDocumentById(id: ObjectId): Observable<IChatDocumentData> {
    return this.apiClient.getChatDocumentById(id);
  }

  /** Returns a document wrapper for a specified chat document data. */
  async getDocumentWrapperFor<T extends IChatDocumentData>(target: T, componentDestroyer$: Observable<void>): Promise<ChatDocumentWrapperBase<T>> {
    // Find the support service for this.
    const service = this.documentSupportServices.find(s => s.documentType === target.type);

    // Validate.
    if (!service) {
      throw new Error(`No document support service found for document type ${target.type}`);
    }

    // Return the result.
    return await service.registerDocument(target, componentDestroyer$);
  }
}
