import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { ChatRoomsService } from '../../../../../services/chat-core/chat-rooms.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IgnoreSpecificAgentPluginParms } from '../../../../../../model/shared-models/chat-core/plugins/ignore-specific-agent-plugin.params';
import { ObjectId } from 'mongodb';
import { AgentInstanceConfiguration } from '../../../../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { AgentInstanceService } from '../../../../../services/chat-core/agent-instance.service';
import { takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AgentConfigurationService } from '../../../../../services/chat-core/agent-configuration.service';
import { ChatAgentIdentityConfiguration } from '../../../../../../model/shared-models/chat-core/agent-configuration.model';

@Component({
  selector: 'app-ignore-specific-agent-plugin-params',
  imports: [
    FormsModule,
    CommonModule,
    CheckboxModule,
  ],
  templateUrl: './ignore-specific-agent-plugin-params.component.html',
  styleUrl: './ignore-specific-agent-plugin-params.component.scss'
})
export class IgnoreSpecificAgentPluginParamsComponent extends ComponentBase {
  constructor(
    readonly agentService: AgentConfigurationService,
    readonly route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      //console.log(params);
      //this.agentService.selectedChatRoomId = params['roomId'];
    });

    this.agentService.agentConfigurations$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(agents => {
      console.log(agents);
      this.agents = agents;
      this.createOptions();
    });
  }

  agents: ChatAgentIdentityConfiguration[] = [];

  private _params!: IgnoreSpecificAgentPluginParms;

  @Input({ required: true })
  get params(): IgnoreSpecificAgentPluginParms {
    return this._params;
  }
  set params(value: IgnoreSpecificAgentPluginParms) {
    this._params = value;
    this.createOptions();
  }

  agentOptions: IgnoreAgentPluginOption[] = [];

  createOptions() {
    if (!this.params?.agentIds) {
      this.agentOptions = [];
      return;
    }
    this.agentOptions = this.agents.map(a => new IgnoreAgentPluginOption(a._id, a.name ?? '', this.params));
  }
}

export class IgnoreAgentPluginOption {
  constructor(
    readonly agentId: ObjectId,
    readonly agentName: string,
    readonly params: IgnoreSpecificAgentPluginParms,
  ) {

  }

  get isChecked(): boolean {
    return this.params.agentIds.some(id => id === this.agentId);
  }
  set isChecked(value: boolean) {
    if (this.isChecked !== value) {
      if (value) {
        this.params.agentIds.push(this.agentId);
      } else {
        const idIndex = this.params.agentIds.findIndex(id => id === this.agentId);
        if (idIndex < 0) {
          throw new Error(`Agent ID not found in options.`);
        }

        this.params.agentIds.splice(idIndex, 1);
      }
    }
  }
}