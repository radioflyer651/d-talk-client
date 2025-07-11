import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { OllamaModelParams } from '../../../../../../model/shared-models/chat-core/chat-model-params/ollama.model-params';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-ollama-config-editor',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    FloatLabelModule,
    CheckboxModule,
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

  get enableNumPredict(): boolean {
    return this.numPredict !== undefined;
  }
  set enableNumPredict(value: boolean) {
    this.numPredict = value ? 1000 : undefined;
  }

  get numPredict(): number | undefined {
    return this.params.serviceParams.numPredict;
  }
  set numPredict(value: number | undefined) {
    this.params.serviceParams.numPredict = value;
  }

  get enableTemperature(): boolean {
    return this.temperature !== undefined;
  }
  set enableTemperature(value: boolean) {
    this.temperature = value ? 0.7 : undefined;
  }

  get temperature(): number | undefined {
    return this.params.serviceParams.temperature;
  }
  set temperature(value: number | undefined) {
    this.params.serviceParams.temperature = value;
  }

  get enableKeepAlive(): boolean {
    return this.keepAlive !== undefined;
  }
  set enableKeepAlive(value: boolean) {
    this.keepAlive = value ? '' : undefined;
  }

  get keepAlive(): string | number | undefined {
    return this.params.serviceParams.keepAlive;
  }
  set keepAlive(value: string | number | undefined) {
    this.params.serviceParams.keepAlive = value;
  }

  get enableFormat(): boolean {
    return this.format !== undefined;
  }
  set enableFormat(value: boolean) {
    this.format = value ? 'json' : undefined;
  }

  get format(): string | undefined {
    return this.params.serviceParams.format;
  }
  set format(value: string | undefined) {
    this.params.serviceParams.format = value;
  }
}
