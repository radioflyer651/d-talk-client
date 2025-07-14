import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of, startWith, Subject, switchMap, shareReplay } from 'rxjs';
import { ObjectId } from 'mongodb';
import { ClientApiService } from './api-clients/api-client.service';
import { ChatDocumentDataListItem, ChatDocumentData } from '../../../model/shared-models/chat-core/chat-document.model';

@Injectable({
  providedIn: 'root'
})
export class ChatDocumentsService {
  constructor(private readonly apiClient: ClientApiService) {
    this.initialize();
  }

  private _reloadDocuments = new Subject<void>();

  // Observable for document list items for the current project
  documentList$: Observable<ChatDocumentDataListItem[]> = this._reloadDocuments.pipe(
    startWith(undefined),
    switchMap(() => {
      if (!this.currentProjectId) return of([]);
      return this.apiClient.getChatDocumentListItemsForProject(this.currentProjectId);
    })
  );

  // Observable for full document list for the current project
  documents$: Observable<ChatDocumentData[]> = this._reloadDocuments.pipe(
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
  createDocument(document: ChatDocumentData) {
    return this.apiClient.createChatDocument(document).pipe(
      switchMap(result => {
        this.reloadDocuments();
        return of(result);
      })
    );
  }

  updateDocument(update: Partial<ChatDocumentData> & { _id: ObjectId; }) {
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

}
