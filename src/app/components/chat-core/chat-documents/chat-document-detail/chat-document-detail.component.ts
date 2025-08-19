import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents/chat-documents.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { lastValueFrom } from 'rxjs';
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';
import { ChatDocumentEditorComponent } from "../chat-document-editor/chat-document-editor.component";
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-chat-document-detail',
  imports: [
    CommonModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ChatDocumentEditorComponent,
    TabsModule,
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

  // private _tabIndex = 0;
  // get tabIndex(): number {
  //   return this._tabIndex;
  // }
  // set tabIndex(value: number) {
  //   this._tabIndex = value;

  //   this.setShowEditor(value === 1);
  // }

  // setShowEditor(newVal: boolean) {
  //   if (this.showEditorTimer) {
  //     clearTimeout(this.showEditorTimer);
  //     this.showEditorTimer = undefined;
  //   }

  //   if (newVal) {
  //     this.showEditorTimer = setTimeout(() => {
  //       this.showEditor = true;
  //     }, 100);
  //   } else {
  //     this.showEditor = false;
  //   }
  // }

  tabIndex = 0;

  showEditor: boolean = false;
  showEditorTimer: any = undefined;

  async saveDocument() {
    if (!this.document) {
      throw new Error(`Document not set.`);
    }

    return await lastValueFrom(this.chatDocumentService.updateDocument(this.document));
  }
}
