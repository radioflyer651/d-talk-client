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
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents/chat-documents.service';
import { TextDocumentWrapper } from '../../../../../model/chat-documents/text-document.wrapper';
import { ComponentBase } from '../../../component-base/component-base.component';
import { BehaviorSubject, from, of, switchMap, takeUntil } from 'rxjs';

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
export class TextDocumentEditorComponent extends ComponentBase {
  constructor(
    readonly sanitizer: DomSanitizer,
    readonly documentService: ChatDocumentsService,
  ) {
    super();
  }


  // #region document
  private readonly _document = new BehaviorSubject<TextDocumentData | undefined>(undefined);
  readonly document$ = this._document.asObservable();

  @Input({ required: true })
  get document(): TextDocumentData | undefined {
    return this._document.getValue();
  }

  set document(newVal: TextDocumentData | undefined) {
    this._document.next(newVal);
  }
  // #endregion

  ngOnInit() {
    this.document$.pipe(
      takeUntil(this.ngDestroy$),
      switchMap(val => {
        if (!val) {
          return of(undefined);
        }

        return from(this.documentService.getDocumentWrapperFor(val, this.ngDestroy$));
      })
    ).subscribe(val => {
      if (this.wrapper) {
        this.wrapper.dispose();
      }

      this.wrapper = val as TextDocumentWrapper;
    });
  }

  wrapper: TextDocumentWrapper | undefined;

  @Input()
  inPopoutScreen: boolean = false;


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
