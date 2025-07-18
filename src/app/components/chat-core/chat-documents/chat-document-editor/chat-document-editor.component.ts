import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';
import { TextDocumentEditorComponent } from "../text-document-editor/text-document-editor.component";

@Component({
  selector: 'app-chat-document-editor',
  imports: [
    CommonModule,
    TextDocumentEditorComponent
],
  templateUrl: './chat-document-editor.component.html',
  styleUrl: './chat-document-editor.component.scss'
})
export class ChatDocumentEditorComponent {

  /** Gets or sets the document being edited in this editor. */
  @Input({ required: true })
  document?: IChatDocumentData;

  @Input()
  inPopoutScreen: boolean = false;
}
