import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { modelList, OpenAiModelParams } from '../../../../../../model/shared-models/chat-core/chat-model-params/open-ai/openai.model-params';
import { TableModule } from 'primeng/table';
import { GptModelInfo } from '../../../../../../model/shared-models/chat-core/chat-model-params/open-ai/gpt-model-info.model';

@Component({
  selector: 'app-openai-config-editor',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    TableModule,
  ],
  templateUrl: './openai-config-editor.component.html',
  styleUrl: './openai-config-editor.component.scss'
})
export class OpenaiConfigEditorComponent extends ComponentBase {
  constructor() {
    super();
  }


  get selection(): GptModelInfo | undefined {
    return this.options.find(o => o.value === this.params?.serviceParams.model);
  }
  set selection(value: GptModelInfo | undefined) {
    if (!this.params?.serviceParams) {
      return;
    }

    this.params!.serviceParams!.model = value!.value;
  }

  @Input({ required: true })
  params!: OpenAiModelParams;

  options = modelList;
}
