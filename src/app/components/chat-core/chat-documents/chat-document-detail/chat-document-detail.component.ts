import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { lastValueFrom } from 'rxjs';
import { TextDocumentEditorComponent } from "../text-document-editor/text-document-editor.component";
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';
import { ChatDocumentEditorComponent } from "../chat-document-editor/chat-document-editor.component";

@Component({
  selector: 'app-chat-document-detail',
  imports: [
    CommonModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    TextDocumentEditorComponent,
    ChatDocumentEditorComponent
],
  templateUrl: './chat-document-detail.component.html',
  styleUrl: './chat-document-detail.component.scss'
})
export class ChatDocumentDetailComponent extends ComponentBase {
  constructor(
    readonly chatDocumentService: ChatDocumentsService,
  ) {
    super();
  }

  @Input({ required: true })
  document: IChatDocumentData | undefined;

  async saveDocument() {
    if (!this.document) {
      throw new Error(`Document not set.`);
    }

    return await lastValueFrom(this.chatDocumentService.updateDocument(this.document));
  }
}
