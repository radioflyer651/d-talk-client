import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';

import { ProjectsService } from '../../../../services/projects.service';
import { ComponentBase } from '../../../component-base/component-base.component';
import { AgentConfigurationService } from '../../../../services/agent-configuration.service';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { AgentTypeSelectorComponent } from "../agent-type-selector/agent-type-selector.component";
import { AgentConfigEditorComponent } from "../agent-config-editors/agent-config-editor/agent-config-editor.component";
import { NewDbItem } from '../../../../../model/shared-models/db-operation-types.model';
import { lastValueFrom, takeUntil } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { InstructionEditorComponent } from "../../../instruction-editor/instruction-editor.component";
import { PositionableMessageListComponent } from "../../positionable-messages/positionable-message-list/positionable-message-list.component";

@Component({
  selector: 'app-agent-config-detail',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    FloatLabelModule,
    PanelModule,
    CardModule,
    ButtonModule,
    AgentTypeSelectorComponent,
    TabsModule,
    PositionableMessageListComponent
],
  templateUrl: './agent-config-detail.component.html',
  styleUrl: './agent-config-detail.component.scss'
})
export class AgentConfigDetailComponent extends ComponentBase {
  constructor(
    readonly projectsService: ProjectsService,
    readonly agentConfigService: AgentConfigurationService
  ) {
    super();
  }

  tabIndex = 0;

  private _isVisible: boolean = false;
  @Input()
  get isVisible(): boolean {
    return this._isVisible;
  }
  set isVisible(value: boolean) {
    this._isVisible = value;
    this.isVisibleChange.next(value);
  }

  @Output()
  isVisibleChange = new EventEmitter<boolean>();

  ngOnInit() {
    this.agentConfigService.selectedAgentConfig$.pipe(
      takeUntil(this.ngDestroy$),
    ).subscribe(config => {
      this.agentConfig = config;
    });
  }

  agentConfig: NewDbItem<ChatAgentIdentityConfiguration> | undefined;

  async onOk() {
    const value = this.agentConfigService.selectedAgentConfig;
    await lastValueFrom(this.agentConfigService.updateAgentConfiguration(value!));
  }

  onCancel() {
    // This shouldn't work.  On first attempt, it does, so we'll keep it until it stops working! :)
    const id = this.agentConfigService.selectedAgentConfigId;
    this.agentConfigService.selectedAgentConfigId = undefined;
    this.agentConfigService.selectedAgentConfigId = id;
  }

}
