import { Component, Input } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { ChatAgentIdentityConfiguration } from '../../../../../../model/shared-models/chat-core/agent-configuration.model';
import { HumeVoiceParametersComponent } from "../voice-provider-config/hume-voice-parameters/hume-voice-parameters.component";
import { OptionsValueTracker } from '../../../../../../utils/options-valuje-tracker.utils';
import { getDefaultHumeVoiceParameters } from '../../../../../../model/shared-models/chat-core/voice/hume-voice-parameters.model';
import { getDefaultOpenaiVoiceParameters } from '../../../../../../model/shared-models/chat-core/voice/open-ai-voice-parameters.model';
import { takeUntil } from 'rxjs';
import { NewDbItem } from '../../../../../../model/shared-models/db-operation-types.model';
import { AiActingInstructionsConfiguration } from '../../../../../../model/shared-models/chat-core/voice/ai-acting-instructions-configuration.model';
import { ActingParameterTypes, ActingParamsHelper } from './acting-params-helper';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AgentConfigEditorComponent } from "../../agent-config-editors/agent-config-editor/agent-config-editor.component";
import { Checkbox } from "primeng/checkbox";
import { AgentTypeSelectorComponent } from "../../agent-type-selector/agent-type-selector.component";

export type VoiceOptionTypes = 'hume' | 'openai' | 'none';

@Component({
  selector: 'app-voice-configuration',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    HumeVoiceParametersComponent,
    RadioButtonModule,
    AgentConfigEditorComponent,
    Checkbox,
    AgentTypeSelectorComponent
],
  templateUrl: './voice-configuration.component.html',
  styleUrls: ['./voice-configuration.component.scss']
})
export class VoiceConfigurationComponent extends ComponentBase {
  constructor(

  ) {
    super();

  }

  voiceTypes = [
    {
      label: 'Hume',
      value: 'hume' as VoiceOptionTypes,
    },
    {
      label: 'OpenAI',
      value: 'openai' as VoiceOptionTypes
    },
    {
      label: 'None',
      value: 'none'
    }
  ];

  ngOnInit() {
    // We need the agent to perform configuration.
    if (this.agentConfiguration) {
      this.initializeOptions();
    }
  }

  private initializeOptions() {
    // We  MUST have an agent to proceed.
    if (!this.agentConfiguration) {
      return;
    }

    this.actingParametersHelper = new ActingParamsHelper();

    // Setup the options container.
    this._optionsContainer = new OptionsValueTracker<VoiceOptionTypes>({
      hume: () => getDefaultHumeVoiceParameters(),
      openai: () => getDefaultOpenaiVoiceParameters(),
      none: () => undefined,

    }, (this.agentConfiguration.voiceMessageParams?.parameterType ?? 'none') as VoiceOptionTypes,
      this.agentConfiguration.voiceMessageParams);

    // Setup a trigger for when changes happen.
    this._optionsContainer.currentValue$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(newValue => {
      this._agentConfiguration.voiceMessageParams = newValue;
      this.actingParametersHelper.voiceParams = newValue;
    });

    this.actingParametersHelper.voiceParams = this.agentConfiguration.voiceMessageParams;
  }

  _optionsContainer!: OptionsValueTracker<VoiceOptionTypes>;
  /** Provides a model to control the acting generation parameters on the voice options,
   *   even though the voice options instance might change, we want these to bve static. */
  actingParametersHelper!: ActingParamsHelper;

  get selectedVoiceType(): VoiceOptionTypes {
    return this._optionsContainer.optionType;
  }
  set selectedVoiceType(value: VoiceOptionTypes) {
    this._optionsContainer.optionType = value;
  }

  private _agentConfiguration!: ChatAgentIdentityConfiguration | NewDbItem<ChatAgentIdentityConfiguration>;
  /** The agent configuration to attach a voice to. */
  @Input({ required: true })
  get agentConfiguration(): ChatAgentIdentityConfiguration | NewDbItem<ChatAgentIdentityConfiguration> {
    return this._agentConfiguration;
  }
  set agentConfiguration(value: ChatAgentIdentityConfiguration | NewDbItem<ChatAgentIdentityConfiguration>) {
    this._agentConfiguration = value;
    this.initializeOptions();
  }
}
