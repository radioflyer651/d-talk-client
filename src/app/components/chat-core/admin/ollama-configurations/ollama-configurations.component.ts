import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { OllamaConfigurationService } from '../../../../services/chat-core/ollama-configuration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { createOllamaConfiguration, OllamaModelConfiguration } from '../../../../../model/shared-models/chat-core/chat-model-params/ollama.model-params';
import { NewDbItem } from '../../../../../model/shared-models/db-operation-types.model';
import { lastValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-ollama-configurations',
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    ButtonModule,
    PanelModule,
  ],
  templateUrl: './ollama-configurations.component.html',
  styleUrl: './ollama-configurations.component.scss'
})
export class OllamaConfigurationsComponent extends ComponentBase {
  constructor(
    readonly ollamaConfigurationService: OllamaConfigurationService,
  ) {
    super();
  }

  selectedConfiguration: OllamaModelConfiguration | NewDbItem<OllamaModelConfiguration> | undefined;

  selectConfiguration(config: OllamaModelConfiguration | undefined) {
    this.isNewItem = false;
    if (config) {
      this.selectedConfiguration = JSON.parse(JSON.stringify(config));
    } else {
      this.selectedConfiguration = undefined;
    }
  }

  isNewItem: boolean = false;

  createNewConfiguration() {
    this.isNewItem = true;
    this.selectedConfiguration = createOllamaConfiguration();
  }

  cancel() {
    this.isNewItem = false;
    this.selectedConfiguration = undefined;
  }

  async save() {
    if (this.isNewItem) {
      await lastValueFrom(this.ollamaConfigurationService.createConfiguration(this.selectedConfiguration as NewDbItem<OllamaModelConfiguration>));
    } else {
      await lastValueFrom(this.ollamaConfigurationService.updateConfiguration(this.selectedConfiguration as OllamaModelConfiguration));
    }

    this.ollamaConfigurationService.reloadConfigs();
  }

}
