import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatDocumentEditorComponent } from "../chat-document-editor/chat-document-editor.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents/chat-documents.service';
import { ActivatedRoute } from '@angular/router';
import { from, of, switchMap, takeUntil } from 'rxjs';
import { ChatDocumentWrapperBase } from '../../../../../model/chat-documents/chat-document-base.wrapper';
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';

@Component({
  selector: 'app-document-popout',
  imports: [
    CommonModule,
    FormsModule,
    ChatDocumentEditorComponent,
  ],
  templateUrl: './document-popout.component.html',
  styleUrl: './document-popout.component.scss'
})
export class DocumentPopoutComponent extends ComponentBase {
  constructor(
    readonly documentService: ChatDocumentsService,
    readonly route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$),
      switchMap(params => {
        const documentId = params['documentId'];
        if (!documentId) {
          return of(undefined);
        }

        return from(this.documentService.getDocumentById(documentId));
      })
    ).subscribe(document => {
      this.document = document;
    });
  }

  private _document: IChatDocumentData | undefined = undefined;
  get document(): IChatDocumentData | undefined {
    return this._document;
  }
  set document(value: IChatDocumentData | undefined) {
    this._document = value;
  }


}
