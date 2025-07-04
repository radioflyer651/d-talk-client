import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { OpenAiModelParams } from '../../../../../../model/shared-models/chat-core/chat-model-params/open-ai/openai.model-params';

@Component({
  selector: 'app-openai-config-editor',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,    
  ],
  templateUrl: './openai-config-editor.component.html',
  styleUrl: './openai-config-editor.component.scss'
})
export class OpenaiConfigEditorComponent extends ComponentBase {
  constructor() {
    super();
  }

  @Input({ required: true })
  params!: OpenAiModelParams;

}
