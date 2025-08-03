import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { modelList, OpenAiModelParams } from '../../../../../../model/shared-models/chat-core/chat-model-params/open-ai/openai.model-params';
import { TableModule } from 'primeng/table';
import { GptModelInfo } from '../../../../../../model/shared-models/chat-core/chat-model-params/open-ai/gpt-model-info.model';
import { SelectModule } from "primeng/select";
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-openai-config-editor',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    FloatLabelModule,
    TableModule,
    SelectModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './openai-config-editor.component.html',
  styleUrl: './openai-config-editor.component.scss'
})
export class OpenaiConfigEditorComponent extends ComponentBase {
  constructor() {
    super();
  }

  displayType: 'table' | 'selection' = 'selection';

  setDisplayType(type: 'table' | 'selection') {
    this.displayType = type;
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

  // Nullable parameter: temperature
  get enableTemperature(): boolean {
    return this.temperature !== undefined;
  }
  set enableTemperature(value: boolean) {
    this.temperature = value ? 0.7 : undefined;
  }
  get temperature(): number | undefined {
    return this.params?.serviceParams?.temperature;
  }
  set temperature(value: number | undefined) {
    if (this.params?.serviceParams) {
      this.params.serviceParams.temperature = value;
    }
  }

  // Nullable parameter: maxTokens
  get enableMaxTokens(): boolean {
    return this.maxTokens !== undefined;
  }
  set enableMaxTokens(value: boolean) {
    this.maxTokens = value ? 1024 : undefined;
  }
  get maxTokens(): number | undefined {
    return this.params?.serviceParams?.maxTokens;
  }
  set maxTokens(value: number | undefined) {
    if (this.params?.serviceParams) {
      this.params.serviceParams.maxTokens = value;
    }
  }

  // Nullable parameter: topP
  get enableTopP(): boolean {
    return this.topP !== undefined;
  }
  set enableTopP(value: boolean) {
    this.topP = value ? 1.0 : undefined;
  }
  get topP(): number | undefined {
    return this.params?.serviceParams?.topP;
  }
  set topP(value: number | undefined) {
    if (this.params?.serviceParams) {
      this.params.serviceParams.topP = value;
    }
  }

  // logprobs (boolean)
  get logprobs(): boolean {
    return !!this.params?.serviceParams?.logprobs;
  }
  set logprobs(value: boolean) {
    if (this.params?.serviceParams) {
      this.params.serviceParams.logprobs = value;
      // If logprobs is disabled, also clear topLogprobs
      if (!value) {
        this.params.serviceParams.topLogprobs = undefined;
      }
    }
  }

  get topLogprobs(): number | undefined {
    return this.params?.serviceParams?.topLogprobs;
  }
  set topLogprobs(value: number | undefined) {
    if (this.params?.serviceParams) {
      this.params.serviceParams.topLogprobs = value;
    }
  }
}
