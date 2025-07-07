import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatJobsService } from '../../../../services/chat-core/chat-jobs.service';
import { AgentConfigurationService } from '../../../../services/chat-core/agent-configuration.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { Observable, of, takeUntil } from 'rxjs';
import { ChatJobConfiguration } from '../../../../../model/shared-models/chat-core/chat-job-data.model';
import { PanelModule } from 'primeng/panel';
import { ChatJobInstance } from '../../../../../model/shared-models/chat-core/chat-job-instance.model';
import { switchMap } from 'rxjs';
import { AgentInstanceService } from '../../../../services/chat-core/agent-instance.service';
import { AgentInstanceConfiguration } from '../../../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-chat-room-detail',
  imports: [
    CommonModule,
    PanelModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    InputText,
    ConfirmDialogModule,
  ],
  templateUrl: './chat-room-detail.component.html',
  styleUrl: './chat-room-detail.component.scss',
  providers: [ConfirmationService]
})
export class ChatRoomDetailComponent extends ComponentBase {
  agentConfigurations$!: Observable<ChatAgentIdentityConfiguration[]>;
  chatJobConfigurations$!: Observable<ChatJobConfiguration[]>;
  chatJobInstances$!: Observable<ChatJobInstance[]>;
  agentInstances$!: Observable<AgentInstanceConfiguration[]>;

  agentNameDialogVisible = false;
  agentNameDialogValue = '';
  agentNameDialogAgent: ChatAgentIdentityConfiguration | null = null;

  constructor(
    readonly chatJobsService: ChatJobsService,
    readonly chatAgentService: AgentConfigurationService,
    readonly projectService: ProjectsService,
    readonly chatRoomService: ChatRoomsService,
    readonly agentInstanceService: AgentInstanceService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly confirmationService: ConfirmationService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.chatRoomService.selectedChatRoomId = params['chatRoomId'];
    });

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

  createAgentInstance(agent: ChatAgentIdentityConfiguration) {
    this.agentNameDialogAgent = agent;
    this.agentNameDialogValue = agent.name || '';
    this.agentNameDialogVisible = true;
  }

  onAgentNameDialogOk() {
    const agent = this.agentNameDialogAgent;
    const chatRoomId = this.chatRoomService.selectedChatRoomId;
    const name = this.agentNameDialogValue.trim();
    if (!chatRoomId || !agent?._id || !name) {
      this.agentNameDialogVisible = false;
      return;
    }
    this.chatRoomService.createAgentInstanceForChatRoom(chatRoomId, agent._id, name).subscribe(() => {
      this.chatRoomService.reloadChatRooms();
      this.agentNameDialogVisible = false;
      this.agentNameDialogAgent = null;
      this.agentNameDialogValue = '';
    });
  }

  onAgentNameDialogCancel() {
    this.agentNameDialogVisible = false;
    this.agentNameDialogAgent = null;
    this.agentNameDialogValue = '';
  }

  confirmDeleteAgentInstance(instance: AgentInstanceConfiguration) {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: `Are you sure you want to delete this agent instance?`,
      accept: () => this.deleteAgentInstance(instance)
    });
  }

  deleteAgentInstance(instance: AgentInstanceConfiguration) {
    this.agentInstanceService.deleteAgentInstance(instance._id).subscribe(() => {
      // Optionally reload chat rooms or agent instances if needed
      this.agentInstanceService.reloadAgentInstances();
    });
  }
}
