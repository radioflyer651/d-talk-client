import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgentConfigListComponent } from './agent-config-list/agent-config-list.component';
import { ListDetailShellComponent } from '../../list-detail-shell/list-detail-shell.component';

@Component({
  selector: 'app-agent-configurations',
  imports: [AgentConfigListComponent, RouterModule, ListDetailShellComponent],
  templateUrl: './agent-configurations.component.html',
  styleUrl: './agent-configurations.component.scss',
})
export class AgentConfigurationsComponent {}
