import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CreateTextDocumentsPluginParams } from '../../../../../../model/shared-models/chat-core/plugins/create-text-documents-plugin.params';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-create-text-file-plugin-params',
  imports: [
    FormsModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    CheckboxModule,
    TextareaModule,
  ],
  templateUrl: './create-text-file-plugin-params.component.html',
  styleUrl: './create-text-file-plugin-params.component.scss'
})
export class CreateTextFilePluginParamsComponent extends ComponentBase {
  constructor(

  ) {
    super();
  }

  @Input({ required: true })
  params!: CreateTextDocumentsPluginParams;

}
