import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentBase } from '../../../../../component-base/component-base.component';
import { VoiceService } from '../../../../../../services/chat-core/voice.service';
import { ReturnVoice, VoiceProvider } from 'hume/api/resources/tts';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { BehaviorSubject, distinctUntilChanged, Observable, of, switchMap, takeUntil } from 'rxjs';
import { HumeVoiceParameters } from '../../../../../../../model/shared-models/chat-core/voice/hume-voice-parameters.model';
import { ModelServiceParams } from '../../../../../../../model/shared-models/chat-core/model-service-params.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { AgentTypeSelectorComponent } from '../../../agent-type-selector/agent-type-selector.component';

@Component({
  selector: 'app-hume-voice-parameters',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    InputNumberModule,
    FloatLabelModule,
    ButtonModule,
    AgentTypeSelectorComponent,
  ],
  templateUrl: './hume-voice-parameters.component.html',
  styleUrls: ['./hume-voice-parameters.component.scss']
})
export class HumeVoiceParametersComponent extends ComponentBase {

  private _humeVoiceParameters!: HumeVoiceParameters;
  @Input({ required: true })
  get humeVoiceParameters(): HumeVoiceParameters {
    return this._humeVoiceParameters;
  }
  set humeVoiceParameters(value: HumeVoiceParameters) {
    this._humeVoiceParameters = value;

    if (value) {
      this.initializeVoiceList();
    }
  }

  constructor(
    readonly voiceService: VoiceService,
  ) {
    super();
  }

  private readonly _humeProviderType = new BehaviorSubject<VoiceProvider | 'none'>('none');
  readonly humeProviderType$ = this._humeProviderType.asObservable();

  get humeProviderType(): VoiceProvider | 'none' {
    return this._humeProviderType.getValue();
  }

  set humeProviderType(newVal: VoiceProvider | 'none') {
    this._humeProviderType.next(newVal);
  }

  ngOnInit() {
    this.initializeVoiceList();
  }

  initializeVoiceList() {
    // We have to have to have the parameters to be able to initialize.
    if (!this.humeVoiceParameters) {
      return;
    }

    // Update the provider type.
    this._humeProviderType.next(this.humeVoiceParameters.voiceProvider!);

    this.voices$ = this._humeProviderType.pipe(
      distinctUntilChanged(),
      switchMap((providerType) => {
        // If we have no parameters (or voice type), then we need to return an empty list.
        if (providerType === 'none') {
          return of([]);
        }

        // Return the API call results.
        return this.voiceService.getHumeVoices(providerType);
      }),
      takeUntil(this.ngDestroy$)
    );

    // When the provider type changes, set it on the voice parameters.
    this._humeProviderType.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(type => {
      this.humeVoiceParameters.voiceProvider = type as VoiceProvider;
    });
  }

  setDefaultSpeed() {
    this.humeVoiceParameters.speed = undefined;
  }

  /** Gets whether dialog extraction is currently enabled. */
  get useDialogExtractionEnabled(): boolean {
    return this.humeVoiceParameters?.useDialogExtraction ?? false;
  }

  /** Toggles dialog extraction on or off, initializing or clearing the model params accordingly. */
  set useDialogExtractionEnabled(value: boolean) {
    if (!this.humeVoiceParameters) {
      return;
    }

    this.humeVoiceParameters.useDialogExtraction = value;

    if (value && !this.humeVoiceParameters.dialogExtractionModelParams) {
      // Seed a sensible default so the model selector has something to display.
      this.humeVoiceParameters.dialogExtractionModelParams = {
        llmService: 'open-ai',
        serviceParams: { model: 'gpt-4.1-nano' },
      } as ModelServiceParams;
    } else if (!value) {
      this.humeVoiceParameters.dialogExtractionModelParams = undefined;
    }
  }

  voices$!: Observable<ReturnVoice[]>;
}
