import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { AgentConfigurationService } from '../../../../services/agent-configuration.service';
import { ProjectsService } from '../../../../services/projects.service';
import { UserService } from '../../../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { FloatLabel } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { ReadonlySubject } from '../../../../../utils/readonly-subject';
import { CreateAgentConfigComponent } from "../create-agent-config/create-agent-config.component";

@Component({
  selector: 'app-agent-config-list',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    PanelModule,
    InputTextModule,
    IftaLabelModule,
    FloatLabel,
    ButtonModule,
    DataViewModule,
    ConfirmDialogModule,
    DialogModule,
    CreateAgentConfigComponent
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
  ) {
    super();
  }

  ngOnInit() {
    this._agentConfigList = new ReadonlySubject(this.ngDestroy$,
      this.searchText$.pipe(
        switchMap((searchText) => {
          return this.agentConfigService.agentConfigurations$.pipe(
            map(configList => {
              return configList.filter(l => l.name.toLowerCase().includes(searchText.toLocaleLowerCase()));
            })
          );
        })
      )
    );
  }

  // #region searchText
  private readonly _searchText = new BehaviorSubject<string>('');
  readonly searchText$ = this._searchText.asObservable();

  get searchText(): string {
    return this._searchText.getValue();
  }

  set searchText(newVal: string) {
    this._searchText.next(newVal);
  }
  // #endregion

  // #region agentConfigList
  private _agentConfigList!: ReadonlySubject<ChatAgentIdentityConfiguration[]>;

  get agentConfigList$() {
    return this._agentConfigList.observable$;
  }

  get agentConfigList(): ChatAgentIdentityConfiguration[] {
    return this._agentConfigList.value;
  }
  // #endregion

  async deleteAgentConfig(config: ChatAgentIdentityConfiguration): Promise<void> {
    this.confirmationService.confirm({
      message: `Are you sure you wish to delete the ${config.name} agent configuration?`,
      accept: async () => {
        return await lastValueFrom(this.agentConfigService.deleteAgentConfiguration(config._id));
      }
    });
  }

  selectAgentConfig(config: ChatAgentIdentityConfiguration) {
    this.agentConfigService.selectedAgentConfigId = config._id;
  }

  isNewAgentConfigDialogVisible: boolean = false;

  createNewAgentConfig() {
    this.isNewAgentConfigDialogVisible = true;
  }

  newAgentConfigName: string = '';

}
