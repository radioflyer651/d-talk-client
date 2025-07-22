import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { ChatDirectoryPermissions } from '../../../../../../model/shared-models/chat-core/documents/chat-document-permissions.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-manage-doc-folder-params',
  imports: [
    FormsModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    CheckboxModule,
    TextareaModule,
  ],
  templateUrl: './manage-doc-folder-params.component.html',
  styleUrl: './manage-doc-folder-params.component.scss'
})
export class ManageDocFolderParamsComponent extends ComponentBase {
  constructor(
  ) {
    super();
  }

  @Input({ required: true })
  params: ChatDirectoryPermissions | undefined;
}
