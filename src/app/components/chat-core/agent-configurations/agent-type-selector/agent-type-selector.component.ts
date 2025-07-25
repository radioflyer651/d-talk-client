import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatModelConfigService } from '../../../../services/chat-core/chat-model-config.service';
import { ModelServiceParams } from '../../../../../model/shared-models/chat-core/model-service-params.model';
import { AgentConfigEditorComponent } from "../agent-config-editors/agent-config-editor/agent-config-editor.component";

type ItemSelection = {
  label: string;
  value: string;
  extendedValue: ModelServiceParams<any>;
};

@Component({
  selector: 'app-agent-type-selector',
  imports: [
    CommonModule,
    FormsModule,
    FloatLabelModule,
    SelectModule,
    PanelModule,
    AgentConfigEditorComponent
  ],
  templateUrl: './agent-type-selector.component.html',
  styleUrl: './agent-type-selector.component.scss'
})
export class AgentTypeSelectorComponent extends ComponentBase {
  constructor(
    readonly chatModelConfigService: ChatModelConfigService,
  ) {
    super();
  }

  options!: ItemSelection[];

  ngOnInit() {
    this.initializeOptions();
  }

  private initializeOptions(): void {
    // Only initialize once.
    if (this.externalValues) {
      return;
    }

    this.externalValues = {};
    this.chatModelConfigService.modelServiceProviders.forEach(s => {
      this.externalValues[s.identifier] = { llmService: s.identifier } as ModelServiceParams;
    });
  }

  externalValues!: { [name: string]: ModelServiceParams; };

  private _value: ModelServiceParams | undefined = undefined;
  @Input()
  get value(): ModelServiceParams | undefined {
    return this._value;
  }
  set value(value: ModelServiceParams | undefined) {
    this.initializeOptions();
    this._value = value;
    this.valueChange.next(value);

    if (value) {
      this.externalValues[value.llmService] = value;
    }
    this.internalValue = value?.llmService;
  }

  @Output()
  valueChange = new EventEmitter<ModelServiceParams | undefined>();

  private _internalValue: string | undefined = undefined;
  get internalValue(): string | undefined {
    return this._internalValue;
  }
  set internalValue(value: string | undefined) {
    if (this._internalValue === value) {
      return;
    }

    this._internalValue = value;

    if (value) {
      this._value = this.externalValues[value];
      if (!this._value.serviceParams) {
        this.chatModelConfigService.getNewParams(value).then(params => {
          this.externalValues[value] = params;
          this._value = params;
          this.valueChange.next(this.value);
        });
      } else {
        this.valueChange.next(this.value);
      }
    } else {
      this.value = undefined;
      this.valueChange.next(this.value);
    }

  }

}
