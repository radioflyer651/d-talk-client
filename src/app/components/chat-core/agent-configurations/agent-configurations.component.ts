import { Component } from '@angular/core';
import { PageSizeService } from '../../../services/page-size.service';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ComponentBase } from '../../component-base/component-base.component';
import { AgentConfigListComponent } from "./agent-config-list/agent-config-list.component";
import { AgentConfigDetailComponent } from "./agent-config-detail/agent-config-detail.component";
import { AgentConfigurationService } from '../../../services/chat-core/agent-configuration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agent-configurations',
  imports: [
    CommonModule,
    FormsModule,
    AgentConfigListComponent,
    AgentConfigDetailComponent,
    RouterModule,
    DrawerModule,
    ButtonModule,
  ],
  templateUrl: './agent-configurations.component.html',
  styleUrl: './agent-configurations.component.scss'
})
export class AgentConfigurationsComponent extends ComponentBase {

  constructor(
    readonly agentService: AgentConfigurationService,
    readonly pageSizeService: PageSizeService,
  ) {
    super();
  }

  private _showDrawer: boolean = true;
  public get showDrawer(): boolean {
    if (!this.pageSizeService.isSkinnyPage) {
      return false;
    }
    return this._showDrawer;
  }
  public set showDrawer(v: boolean) {
    this._showDrawer = v;
  }

  openDrawer() {
    this.showDrawer = true;
  }

  closeDrawer() {
    this.showDrawer = false;
  }


}
