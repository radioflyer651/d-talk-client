import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { OllamaConfigEditorComponent } from '../ollama-config-editor/ollama-config-editor.component';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { OpenaiConfigEditorComponent } from "../openai-config-editor/openai-config-editor.component";
import { ModelServiceParams } from '../../../../../../model/shared-models/chat-core/model-service-params.model';

@Component({
  selector: 'app-agent-config-editor',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    OllamaConfigEditorComponent,
    OpenaiConfigEditorComponent
  ],
  templateUrl: './agent-config-editor.component.html',
  styleUrl: './agent-config-editor.component.scss'
})
export class AgentConfigEditorComponent extends ComponentBase {
  constructor() {
    super();
  }

  @Input({ required: true })
  params: ModelServiceParams<any> | undefined;

  get modelType() {
    return this.params?.llmService;
  }
}
