import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AgentTypeSelectorComponent } from '../../../agent-configurations/agent-type-selector/agent-type-selector.component';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { ActivatedRoute } from '@angular/router';
import { ObjectId } from 'mongodb';
import { takeUntil } from 'rxjs';
import { LabeledMemory2PluginParams } from '../../../../../../model/shared-models/chat-core/plugins/labeled-memory-plugin2.params';
import { OpenAiModelService } from '../../../../../chat-core-services/model-services/open-ai.model-service';
import { CurrentRouteParamsService } from '../../../../../services/current-route-params.service';

@Component({
  selector: 'app-label-memory2-plugin-params',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    TextareaModule,
    FloatLabelModule,
    AgentTypeSelectorComponent
  ],
  templateUrl: './label-memory2-plugin-params.component.html',
  styleUrl: './label-memory2-plugin-params.component.scss'
})
export class LabelMemory2PluginParamsComponent extends ComponentBase {
  private _params!: LabeledMemory2PluginParams;

  memoryKeyPrefixString: string = '';
  keyMeaningsString: string = '';
  projectId!: ObjectId;

  @Input({ required: true })
  get params(): LabeledMemory2PluginParams {
    return this._params;
  }
  set params(value: LabeledMemory2PluginParams) {
    this._params = value;

    this.ensureLlm();

  }

  constructor(
    private route: ActivatedRoute,
    private currentRouteService: CurrentRouteParamsService,
  ) {
    super();
  }

  ngOnInit() {
    this.currentRouteService.params$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.projectId = params['projectId'];
      this.ensureLlm();
      this.setProjectId();
    });

    this.ensureLlm();
  }

  private setProjectId() {
    const value = this.params;

    if (!value) {
      return;
    }

    if (value && !value.memoryNamespace.startsWith(this.projectId)) {
      value.memoryNamespace = `${this.projectId}/${value.memoryNamespace}`;
    }
  }

  private async ensureLlm() {
    if (!this._params) {
      return;
    }

    if (!this._params.modelServiceParams || this.params.modelServiceParams.llmService === '') {
      const openAiService = new OpenAiModelService();
      this._params.modelServiceParams = await openAiService.createParams();
    }
  }

  get namespace(): string {
    return this.params.memoryNamespace.replace(new RegExp(`^${this.projectId}\\/`), '');
  }
  set namespace(value: string) {
    this.params.memoryNamespace = value;
    this.setProjectId();
  }
}
