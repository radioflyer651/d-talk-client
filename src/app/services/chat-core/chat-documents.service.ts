import { Injectable } from '@angular/core';
import { Observable, of, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { ObjectId } from 'mongodb';
import { ClientApiService } from './api-clients/api-client.service';
import { NewDbItem } from '../../../model/shared-models/db-operation-types.model';
import { IChatDocumentCreationParams, IChatDocumentData } from '../../../model/shared-models/chat-core/documents/chat-document.model';

@Injectable({
  providedIn: 'root'
})
export class ChatDocumentsService {
  constructor(
    private readonly apiClient: ClientApiService
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
}
