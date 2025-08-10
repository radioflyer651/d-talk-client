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
import { lastValueFrom, map, Observable, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService } from 'primeng/api';

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
    CheckboxModule,
    InputNumberModule,
  ],
  templateUrl: './ollama-configurations.component.html',
  styleUrl: './ollama-configurations.component.scss'
})
export class OllamaConfigurationsComponent extends ComponentBase {
  constructor(
    readonly ollamaConfigurationService: OllamaConfigurationService,
    readonly confirmationService: ConfirmationService,
  ) {
    super();
  }

  configurationList$!: Observable<OllamaModelConfiguration[]>;

  ngOnInit() {
    this.configurationList$ = this.ollamaConfigurationService.allConfigurations$.pipe(
      takeUntil(this.ngDestroy$),
      map(list => {
        list.sort((m1, m2) => m1.displayName.localeCompare(m2.displayName));
        return list;
      })
    );
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

  get isMaxContextEnabled(): boolean {
    return this.selectedConfiguration?.maxContext != undefined;
  }
  set isMaxContextEnabled(value: boolean) {
    if (!this.selectedConfiguration) {
      return;
    }

    if (value) {
      this.selectedConfiguration.maxContext = 16000;
    } else {
      this.selectedConfiguration.maxContext = undefined;
    }
  }

  deleteConfiguration(config: OllamaModelConfiguration) {
    this.confirmationService.confirm({
      header: 'Confirm Delete',
      message: `Are you sure you wish to delete the ${config.displayName} configuration?`,
      accept: async () => {
        await lastValueFrom(this.ollamaConfigurationService.deleteConfiguration(config._id));
        this.ollamaConfigurationService.reloadConfigs();
      }
    });
  }


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
