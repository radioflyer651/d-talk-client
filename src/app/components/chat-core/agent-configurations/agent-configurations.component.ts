import { Component } from '@angular/core';
import { ComponentBase } from '../../component-base/component-base.component';
import { AgentConfigListComponent } from "./agent-config-list/agent-config-list.component";
import { AgentConfigDetailComponent } from "./agent-config-detail/agent-config-detail.component";
import { AgentConfigurationService } from '../../../services/agent-configuration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agent-configurations',
  imports: [
    CommonModule,
    FormsModule,
    AgentConfigListComponent,
    AgentConfigDetailComponent
  ],
  templateUrl: './agent-configurations.component.html',
  styleUrl: './agent-configurations.component.scss'
})
export class AgentConfigurationsComponent extends ComponentBase {
  constructor(
    readonly agentService: AgentConfigurationService,
  ) {
    super();
  }


}
