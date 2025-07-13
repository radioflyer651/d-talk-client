import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { LabeledMemoryPluginParams } from '../../../../../../model/shared-models/chat-core/plugins/labeled-memory-plugin.params';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { OpenAiModelService } from '../../../../../chat-core-services/model-services/open-ai.model-service';
import { AgentTypeSelectorComponent } from "../../../agent-configurations/agent-type-selector/agent-type-selector.component";
import { ObjectId } from 'mongodb';
import { takeUntil } from 'rxjs';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { CurrentRouteParamsService } from '../../../../../services/current-route-params.service';

@Component({
  selector: 'app-label-memory-plugin-params',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    TextareaModule,
    FloatLabelModule,
    AgentTypeSelectorComponent
  ],
  templateUrl: './label-memory-plugin-params.component.html',
  styleUrl: './label-memory-plugin-params.component.scss'
})
export class LabeledMemoryPluginParamsComponent extends ComponentBase implements OnInit {
  private _params!: LabeledMemoryPluginParams;

  memoryKeyPrefixString: string = '';
  keyMeaningsString: string = '';
  projectId!: ObjectId;

  @Input({ required: true })
  get params(): LabeledMemoryPluginParams {
    return this._params;
  }
  set params(value: LabeledMemoryPluginParams) {
    this._params = value;

    this.ensureProjectId();
    this.ensureLlm();

    this.memoryKeyPrefixString = (value.memoryKeyPrefix || []).join('/');
    this.keyMeaningsString = (value.keyMeanings || []).join('/');
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
      this.ensureProjectId();
      this.ensureLlm();
    });

    this.ensureLlm();

    if (this._params) {
      this.memoryKeyPrefixString = (this._params.memoryKeyPrefix || []).join('/');
      this.keyMeaningsString = (this._params.keyMeanings || []).join('/');
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

  private ensureProjectId() {
    if (!this._params) {
      return;
    }

    if ((!this._params.projectId || this._params.projectId.trim() === '') && this.projectId) {
      this._params.projectId = this.projectId;
    }
  }

  onMemoryKeyPrefixChange(value: string) {
    this.memoryKeyPrefixString = value;
    this._params.memoryKeyPrefix = value.split('/').map(v => v.trim()).filter(v => v.length > 0);
  }

  onKeyMeaningsChange(value: string) {
    this.keyMeaningsString = value;
    this._params.keyMeanings = value.split('/').map(v => v.trim()).filter(v => v.length > 0);
  }
}
