import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { OllamaModelParams } from '../../../../../../model/shared-models/chat-core/chat-model-params/ollama.model-params';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-ollama-config-editor',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
  ],
  templateUrl: './ollama-config-editor.component.html',
  styleUrl: './ollama-config-editor.component.scss'
})
export class OllamaConfigEditorComponent extends ComponentBase {
  constructor() {
    super();
  }

  @Input({ required: true })
  params!: OllamaModelParams;
}
