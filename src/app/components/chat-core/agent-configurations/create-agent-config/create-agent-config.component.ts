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

import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ComponentBase } from '../../../component-base/component-base.component';
import { AgentConfigurationService } from '../../../../services/chat-core/agent-configuration.service';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { AgentTypeSelectorComponent } from "../agent-type-selector/agent-type-selector.component";
import { AgentConfigEditorComponent } from "../agent-config-editors/agent-config-editor/agent-config-editor.component";
import { NewDbItem } from '../../../../../model/shared-models/db-operation-types.model';

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
    AgentTypeSelectorComponent,
    AgentConfigEditorComponent
  ],
  templateUrl: './create-agent-config.component.html',
  styleUrl: './create-agent-config.component.scss'
})
export class CreateAgentConfigComponent extends ComponentBase {
  constructor(
    readonly projectsService: ProjectsService,
    readonly agentConfigService: AgentConfigurationService
  ) {
    super();
  }


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
    this.agentConfig = {
      modelInfo: undefined as any, // We'll fill this in with the editor.
      projectId: this.projectsService.currentProjectId!,
      name: '',
      chatName: '',
      description: '',
      identityStatements: [],
      baseInstructions: [],
      chatDocumentReferences: [],
      plugins: []
    };
  }

  agentConfig!: NewDbItem<ChatAgentIdentityConfiguration>;

  async onOk() {
    if (!this.agentConfig.name || !this.agentConfig.chatName) {
      return;
    }
    await this.agentConfigService.createAgentConfiguration(this.agentConfig).toPromise();
    this.agentConfigService.reloadAgentConfigurations();
    this.isVisible = false;
    // Optionally reset the form
    this.agentConfig = {
      modelInfo: { llmService: '', serviceParams: {} },
      projectId: this.projectsService.currentProjectId!,
      name: '',
      chatName: '',
      description: '',
      identityStatements: [],
      baseInstructions: [],
      chatDocumentReferences: [],
      plugins: []
    };
  }

  onCancel() {
    this.isVisible = false;
  }

}
