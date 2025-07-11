import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatJobsService } from '../../../../services/chat-core/chat-jobs.service';
import { AgentConfigurationService } from '../../../../services/chat-core/agent-configuration.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { Observable, takeUntil } from 'rxjs';
import { ChatJobConfiguration } from '../../../../../model/shared-models/chat-core/chat-job-data.model';
import { PanelModule } from 'primeng/panel';
import { ChatJobInstance } from '../../../../../model/shared-models/chat-core/chat-job-instance.model';
import { AgentInstanceService } from '../../../../services/chat-core/agent-instance.service';
import { AgentInstanceConfiguration } from '../../../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LinkedJobInstance } from '../../../../../model/linked-job-instance.model';
import { CheckboxModule } from 'primeng/checkbox';

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
    CheckboxModule,
  ],
  templateUrl: './chat-room-detail.component.html',
  styleUrl: './chat-room-detail.component.scss',
  providers: [ConfirmationService]
})
export class ChatRoomDetailComponent extends ComponentBase {
  agentConfigurations$!: Observable<ChatAgentIdentityConfiguration[]>;
  chatJobConfigurations$!: Observable<ChatJobConfiguration[]>;
  chatJobInstances$!: Observable<LinkedJobInstance[]>;
  agentInstances$!: Observable<AgentInstanceConfiguration[]>;

  agentNameDialogVisible = false;
  agentNameDialogValue = '';
  agentNameDialogAgent: ChatAgentIdentityConfiguration | null = null;

  dragOverIndex: number | null = null;
  draggedJobIndex: number | null = null;

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
      this.agentInstanceService.selectedChatRoomId = params['chatRoomId'];
    });

    this.agentConfigurations$ = this.chatAgentService.agentConfigurations$;
    this.chatJobConfigurations$ = this.chatJobsService.jobs$;
    this.agentInstances$ = this.agentInstanceService.agentInstances$;

    this.chatJobInstances$ = this.chatRoomService.selectedChatRoomJobInstances$;
    this.chatJobInstances$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe();
  }

  createAgentInstance(agent: ChatAgentIdentityConfiguration) {
    this.agentNameDialogAgent = agent;
    this.agentNameDialogValue = agent.chatName || '';
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
      this.chatRoomService.reloadSelectedChatRoom();
      this.agentInstanceService.reloadAgentInstances();
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

  confirmDeleteJobInstance(instance: ChatJobInstance) {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: `Are you sure you want to delete this job instance?`,
      accept: () => this.deleteJobInstance(instance)
    });
  }

  deleteJobInstance(instance: ChatJobInstance) {
    const chatRoomId = this.chatRoomService.selectedChatRoomId;
    if (!chatRoomId || !instance.id) {
      return;
    }

    this.chatRoomService.deleteJobInstanceFromChatRoom(chatRoomId, instance.id).subscribe(() => {
      this.chatRoomService.reloadSelectedChatRoom();
    });
  }

  createJobInstance(job: ChatJobConfiguration) {
    const chatRoomId = this.chatRoomService.selectedChatRoomId;
    if (!chatRoomId || !job._id) {
      return;
    }

    this.chatRoomService.createJobInstanceForChatRoom(chatRoomId, job._id).subscribe(() => {
      this.chatRoomService.reloadSelectedChatRoom();
    });
  }

  // Placeholder for agent add/remove logic for job instances
  onAddAgent(instance: LinkedJobInstance) {
    // TODO: Implement agent assignment logic
  }

  onRemoveAgent(instance: LinkedJobInstance) {
    this.confirmationService.confirm({
      header: 'Remove Agent',
      message: 'Are you sure you want to remove this agent from the job instance?',
      accept: () => {
        const chatRoomId = this.chatRoomService.selectedChatRoomId;
        if (chatRoomId && instance.id) {
          this.chatRoomService.removeAgentFromJobInstance(chatRoomId, instance.id).subscribe(() => {
            this.chatRoomService.reloadSelectedChatRoom();
          });
        }
      }
    });
  }

  // Drag-and-drop for assigning agent to job instance
  private draggedAgentInstanceId: string | undefined;

  onAgentInstanceDragStart(event: DragEvent, instance: AgentInstanceConfiguration) {
    this.draggedAgentInstanceId = instance._id;

    if (event.dataTransfer) {
      event.dataTransfer.setData('agentInstanceId', instance._id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onAgentInstanceDragEnd(event: DragEvent, instance: AgentInstanceConfiguration) {
    this.draggedAgentInstanceId = undefined;
  }

  onJobInstanceDragStart(event: DragEvent, instance: LinkedJobInstance, index: number) {
    this.draggedJobIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('jobInstanceId', instance.id);
      event.dataTransfer.setData('jobIndex', index.toString());
    }
  }

  onJobInstanceDragEnd(event: DragEvent, instance: LinkedJobInstance, index: number) {
    this.draggedJobIndex = null;
    this.dragOverIndex = null;
  }

  onJobInstanceDragEnter(event: DragEvent, index: number) {
    event.preventDefault();
    this.dragOverIndex = index;
  }

  onJobInstanceDragLeave(event: DragEvent, index: number) {
    event.preventDefault();
    this.dragOverIndex = null;
  }

  onJobInstanceDragOver(event: DragEvent, instance: LinkedJobInstance, index: number) {
    event.preventDefault();
    this.dragOverIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onJobInstanceDrop(event: DragEvent, instance: LinkedJobInstance, index: number) {
    event.preventDefault();
    const agentInstanceId = event.dataTransfer?.getData('agentInstanceId');
    const jobIndexStr = event.dataTransfer?.getData('jobIndex');
    const jobInstanceId = event.dataTransfer?.getData('jobInstanceId');
    const chatRoomId = this.chatRoomService.selectedChatRoomId;

    // If agentInstanceId is present, this is an agent assignment drop
    if (chatRoomId && instance.id && agentInstanceId) {
      this.chatRoomService.assignAgentToJobInstance(chatRoomId, instance.id, agentInstanceId).subscribe(() => {
        this.chatRoomService.reloadSelectedChatRoom();
      });
      this.draggedJobIndex = null;
      this.dragOverIndex = null;
      return;
    }

    // Otherwise, handle job reordering
    if (chatRoomId && jobInstanceId && typeof jobIndexStr === 'string') {
      const fromIndex = parseInt(jobIndexStr, 10);
      if (fromIndex !== index) {
        this.chatRoomService.setChatJobOrder(jobInstanceId, index).then(() => {
          this.chatRoomService.reloadSelectedChatRoom();
        });
      }
    }
    this.draggedJobIndex = null;
    this.dragOverIndex = null;
  }

  async setAgentDisabled(job: ChatJobInstance): Promise<void> {
    // Send the actual value to the server.  Because of 2-way binding, the value of disabled should already be set to the proper value.
    await this.chatRoomService.setDisabledChatRoomJob(job.id, job.disabled);
  }

}
