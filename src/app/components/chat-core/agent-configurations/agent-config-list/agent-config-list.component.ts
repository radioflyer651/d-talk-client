import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { AgentConfigurationService } from '../../../../services/chat-core/agent-configuration.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { UserService } from '../../../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { takeUntil } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { CreateAgentConfigComponent } from "../create-agent-config/create-agent-config.component";
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';

interface ChatAgentGroup {
  group: string,
  items: ChatAgentIdentityConfiguration[],
}

@Component({
  selector: 'app-agent-config-list',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    PanelModule,
    InputTextModule,
    IftaLabelModule,
    ButtonModule,
    DataViewModule,
    ConfirmDialogModule,
    DialogModule,
    CreateAgentConfigComponent,
    AccordionModule,
  ],
  templateUrl: './agent-config-list.component.html',
  styleUrl: './agent-config-list.component.scss'
})
export class AgentConfigListComponent extends ComponentBase {
  constructor(
    readonly agentConfigService: AgentConfigurationService,
    readonly projectService: ProjectsService,
    readonly userService: UserService,
    readonly confirmationService: ConfirmationService,
    readonly sanitizer: DomSanitizer,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) {
    super();
  }

  agentList: ChatAgentIdentityConfiguration[] = [];
  selectedAgentGroupId: string = '';
  agentGroups: ChatAgentGroup[] = [];

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      // this.agentConfigService.selectedAgentConfigId = params['agentConfigId'];
    });

    this.agentConfigService.agentConfigurations$.pipe(
      takeUntil(this.ngDestroy$),
    ).subscribe(agents => {
      this.agentList = agents;
      this.updateAgentGroups();
    });
  }

  updateAgentGroups() {
    const generalGroup: ChatAgentGroup = {
      group: 'Ungrouped',
      items: []
    };

    const groups: ChatAgentGroup[] = [];

    /** Returns a group from the groups list, for a specified agent.  If none exists, one is created. */
    function findGroup(job: ChatAgentIdentityConfiguration) {
      if (!job.group) {
        return generalGroup;
      }

      let result = groups.find(g => g.group.toLocaleLowerCase() === job.group?.toLocaleLowerCase());
      if (!result) {
        result = {
          group: job.group!,
          items: []
        };

        groups.push(result);
      }

      return result;
    }

    // Add all of the items to groups.
    this.agentList.forEach(j => {
      const group = findGroup(j);
      group.items.push(j);
    });


    // If the general group has something in it, then include it.
    if (generalGroup.items.length > 0) {
      groups.push(generalGroup);
    }

    // Sort the list.
    groups.sort((g1, g2) => {
      return g1.group.localeCompare(g2.group);
    });

    // Update the group list.
    this.agentGroups = groups;
  }

  async deleteAgentConfig(config: ChatAgentIdentityConfiguration): Promise<void> {
    this.confirmationService.confirm({
      message: `Are you sure you wish to delete the ${config.name} agent configuration?`,
      accept: async () => {
        return await lastValueFrom(this.agentConfigService.deleteAgentConfiguration(config._id));
      }
    });
  }

  selectAgentConfig(config: ChatAgentIdentityConfiguration) {
    this.router.navigate([config._id], { relativeTo: this.route });
    //this.agentConfigService.selectedAgentConfigId = config._id;
  }

  isNewAgentConfigDialogVisible: boolean = false;

  createNewAgentConfig() {
    this.isNewAgentConfigDialogVisible = true;
  }

  newAgentConfigName: string = '';

  getAgentDescription(agent: ChatAgentIdentityConfiguration) {
    const result = this.sanitizer.bypassSecurityTrustHtml(agent.description?.replaceAll('\n', '<br/>') ?? '');
    return result;
  }

}
