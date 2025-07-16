import { Injectable } from '@angular/core';
import { IDocumentSupportService } from './document-support-service.interface';
import { SocketService } from '../../socket.service';
import { TEXT_DOCUMENT_TYPE } from '../../../../model/shared-models/chat-core/documents/document-type.constants';
import { TextDocumentWrapper } from '../../../../model/chat-documents/text-document.wrapper';
import { TextDocumentData } from '../../../../model/shared-models/chat-core/documents/document-types/text-document.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextDocumentService implements IDocumentSupportService {
  constructor(
    readonly socketService: SocketService,
  ) { }

  readonly documentType = TEXT_DOCUMENT_TYPE;

  async registerDocument(document: TextDocumentData, destroyer$: Observable<void>): Promise<TextDocumentWrapper> {
    return new TextDocumentWrapper(document, this.socketService);
  }
}
