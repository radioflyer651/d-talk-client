import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentBase } from '../../../../../component-base/component-base.component';
import { OllamaConfigurationService } from '../../../../../../services/chat-core/ollama-configuration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ObjectId } from 'mongodb';
import { OllamaModelConfiguration } from '../../../../../../../model/shared-models/chat-core/chat-model-params/ollama.model-params';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-ollama-model-list',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './ollama-model-list.component.html',
  styleUrl: './ollama-model-list.component.scss'
})
export class OllamaModelListComponent extends ComponentBase {
  constructor(
    readonly ollamaConfigService: OllamaConfigurationService,
  ) {
    super();
  }

  ngOnInit() {
    this.ollamaConfigService.allConfigurations$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(configs => {
      this.options = configs;
    });
  }

  options: OllamaModelConfiguration[] = [];

  private _selectedId: ObjectId | undefined = undefined;
  @Input({ required: true })
  get selectedId(): ObjectId | undefined {
    return this._selectedId;
  }
  set selectedId(value: ObjectId | undefined) {
    this._selectedId = value;
    this.selectedIdChange.next(value);
  }

  @Output()
  selectedIdChange = new EventEmitter<ObjectId | undefined>();

}
