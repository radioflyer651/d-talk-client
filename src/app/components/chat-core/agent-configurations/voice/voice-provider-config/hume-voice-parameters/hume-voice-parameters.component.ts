import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentBase } from '../../../../../component-base/component-base.component';
import { VoiceService } from '../../../../../../services/chat-core/voice.service';
import { HumeVoiceType } from '../../../../../../services/chat-core/api-clients/api-client.service';
import { ReturnVoice, VoiceProvider } from 'hume/api/resources/tts';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BehaviorSubject, distinctUntilChanged, Observable, of, switchMap, takeUntil } from 'rxjs';
import { HumeVoiceParameters } from '../../../../../../../model/shared-models/chat-core/voice/hume-voice-parameters.model';

@Component({
  selector: 'app-hume-voice-parameters',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    RadioButtonModule,
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

  voices$!: Observable<ReturnVoice[]>;
}
