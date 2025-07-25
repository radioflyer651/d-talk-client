import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatDocumentListComponent } from './chat-document-list/chat-document-list.component';
import { ChatDocumentDetailComponent } from "./chat-document-detail/chat-document-detail.component";
import { ComponentBase } from '../../component-base/component-base.component';
import { CurrentRouteParamsService } from '../../../services/current-route-params.service';
import { of, switchMap, takeUntil } from 'rxjs';
import { ChatDocumentsService } from '../../../services/chat-core/chat-documents/chat-documents.service';
import { CommonModule } from '@angular/common';
import { IChatDocumentData } from '../../../../model/shared-models/chat-core/documents/chat-document.model';
import { DocumentTreeListComponent } from "./document-tree-list/document-tree-list.component";

@Component({
  selector: 'app-chat-documents',
  imports: [
    CommonModule,
    RouterModule,
    ChatDocumentDetailComponent,
    DocumentTreeListComponent
],
  templateUrl: './chat-documents.component.html',
  styleUrl: './chat-documents.component.scss'
})
export class ChatDocumentsComponent extends ComponentBase {
  constructor(
    readonly paramsService: CurrentRouteParamsService,
    readonly documentService: ChatDocumentsService,
  ) {
    super();
  }

  ngOnInit() {
    this.paramsService.params$.pipe(
      takeUntil(this.ngDestroy$),
      switchMap(params => {
        const docId = params['documentId'];
        if (!docId) {
          return of(undefined);
        }

        return this.documentService.getDocumentById(docId);
      })
    ).subscribe(document => {
      this.document = document;
    });
  }

  document?: IChatDocumentData;
}
