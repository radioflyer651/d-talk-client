import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatJobsService } from '../../../../services/chat-core/chat-jobs.service';
import { AgentConfigurationService } from '../../../../services/chat-core/agent-configuration.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { Observable, of } from 'rxjs';
import { ChatJobConfiguration } from '../../../../../model/shared-models/chat-core/chat-job-data.model';
import { PanelModule } from 'primeng/panel';
import { ChatJobInstance } from '../../../../../model/shared-models/chat-core/chat-job-instance.model';
import { switchMap } from 'rxjs';
import { AgentInstanceService } from '../../../../services/chat-core/agent-instance.service';
import { AgentInstanceConfiguration } from '../../../../../model/shared-models/chat-core/agent-instance-configuration.model';

@Component({
  selector: 'app-chat-room-detail',
  imports: [CommonModule, PanelModule],
  templateUrl: './chat-room-detail.component.html',
  styleUrl: './chat-room-detail.component.scss'
})
export class ChatRoomDetailComponent extends ComponentBase {
  agentConfigurations$!: Observable<ChatAgentIdentityConfiguration[]>;
  chatJobConfigurations$!: Observable<ChatJobConfiguration[]>;
  chatJobInstances$!: Observable<ChatJobInstance[]>;
  agentInstances$!: Observable<AgentInstanceConfiguration[]>;

  constructor(
    readonly chatJobsService: ChatJobsService,
    readonly chatAgentService: AgentConfigurationService,
    readonly projectService: ProjectsService,
    readonly chatRoomService: ChatRoomsService,
    readonly agentInstanceService: AgentInstanceService,
  ) {
    super();
  }

  ngOnInit() {
    this.agentConfigurations$ = this.chatAgentService.agentConfigurations$;
    this.chatJobConfigurations$ = this.chatJobsService.jobs$;
    this.chatJobInstances$ = this.getJobInstancesForCurrentProject();
    this.agentInstances$ = this.agentInstanceService.agentInstances$;
  }

  private getJobInstancesForCurrentProject(): Observable<ChatJobInstance[]> {
    return this.projectService.currentProject$.pipe(
      switchMap(project => {
        if (!project || !project._id) return of([]);
        // Fallback: try to get job instances from all chat rooms in the project
        const chatRooms = this.chatRoomService.chatRooms.filter(r => r.projectId?.toString() === project._id.toString());
        const allInstances = chatRooms.flatMap(r => r.jobs || []);
        return of(allInstances);
      })
    );
  }
}
