import { Component, Input } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DomSanitizer } from '@angular/platform-browser';
import { TextDocumentData } from '../../../../../model/shared-models/chat-core/documents/document-types/text-document.model';

@Component({
  selector: 'app-text-document-editor',
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
  templateUrl: './text-document-editor.component.html',
  styleUrl: './text-document-editor.component.scss'
})
export class TextDocumentEditorComponent {
  constructor(
    readonly sanitizer: DomSanitizer,
  ) {
  }

  @Input({ required: true })
  document: TextDocumentData | undefined;

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
