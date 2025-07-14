import { Component, Input } from '@angular/core';
import { ChatDocumentData } from '../../../../../model/shared-models/chat-core/chat-document.model';
import { EditorModule } from 'primeng/editor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-document-editor',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    EditorModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    SelectButtonModule,
  ],
  templateUrl: './chat-document-editor.component.html',
  styleUrl: './chat-document-editor.component.scss'
})
export class ChatDocumentEditorComponent {
  constructor(
    readonly sanitizer: DomSanitizer,
  ) {
  }

  @Input({ required: true })
  document: ChatDocumentData | undefined;

  modeOptions = [
    {
      label: 'Plain Text',
      value: 'text'
    },
    {
      label: 'Rich Editor',
      value: 'formatted'
    },
    {
      label: 'Rendered Markup',
      value: 'rendered'
    },
  ];

  mode = 'text';

  get htmlContent() {
    return this.sanitizer.bypassSecurityTrustHtml(this.document?.content ?? '');
  }
}
