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

export type VoiceOptionTypes = 'hume' | 'openai' | 'none';

@Component({
  selector: 'app-voice-configuration',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    HumeVoiceParametersComponent
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
    });
  }

  _optionsContainer!: OptionsValueTracker<VoiceOptionTypes>;

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
