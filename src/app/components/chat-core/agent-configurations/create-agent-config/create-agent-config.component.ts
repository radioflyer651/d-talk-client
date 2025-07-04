import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { ObjectId } from 'mongodb';

@Component({
  selector: 'app-create-agent-config',
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
  ],
  templateUrl: './create-agent-config.component.html',
  styleUrl: './create-agent-config.component.scss'
})
export class CreateAgentConfigComponent extends ComponentBase {
  isDialogVisible = false;

  agentConfig: ChatAgentIdentityConfiguration = {
    modelInfo: { llmService: '', serviceParams: {} },
    projectId: undefined as unknown as ObjectId,
    name: '',
    chatName: '',
    description: '',
    identityStatements: [],
    baseInstructions: [],
    plugins: []
  };

  constructor(
    readonly projectsService: ProjectsService,
    readonly agentConfigService: AgentConfigurationService
  ) {
    super();
    if (this.projectsService.currentProjectId) {
      this.agentConfig.projectId = this.projectsService.currentProjectId;
    }
  }

  async onOk() {
    if (!this.agentConfig.name || !this.agentConfig.chatName) {
      return;
    }
    await this.agentConfigService.createAgentConfiguration(this.agentConfig).toPromise();
    this.agentConfigService.reloadAgentConfigurations();
    this.isDialogVisible = false;
    // Optionally reset the form
    this.agentConfig = {
      modelInfo: { llmService: '', serviceParams: {} },
      projectId: this.projectsService.currentProjectId!,
      name: '',
      chatName: '',
      description: '',
      identityStatements: [],
      baseInstructions: [],
      plugins: []
    };
  }

  onCancel() {
    this.isDialogVisible = false;
  }
}
