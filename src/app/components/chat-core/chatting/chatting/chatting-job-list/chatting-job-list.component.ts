import { Component } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { ChattingService } from '../../../../../services/chat-core/chatting.service';
import { ChatRoomsService } from '../../../../../services/chat-core/chat-rooms.service';
import { ChatJobsService } from '../../../../../services/chat-core/chat-jobs.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChatJobInstance } from '../../../../../../model/shared-models/chat-core/chat-job-instance.model';
import { AgentInstanceService } from '../../../../../services/chat-core/agent-instance.service';
import { ProjectsService } from '../../../../../services/chat-core/projects.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ChatJobOrderControlComponent } from "../../../chat-job-order-control/chat-job-order-control.component";
import { LinkedJobInstance } from '../../../../../../model/linked-job-instance.model';
import { ClientApiService } from '../../../../../services/chat-core/api-clients/api-client.service';
import { PositionableMessage } from '../../../../../../model/shared-models/chat-core/positionable-message.model';
import { StoredMessage } from '@langchain/core/messages';
import { isMessageDisabled, setMessageDisabledValue } from '../../../../../../model/shared-models/chat-core/utils/messages.utils';
import { ObjectId } from 'mongodb';
import { AgentConfigurationService } from '../../../../../services/chat-core/agent-configuration.service';
import { ChatLinkingService } from '../../../../../services/chat-core/chat-linking.service';
import { ChatJobLink } from '../../../../../../model/chat-element-links.models';
import { ChatAgentIdentityConfiguration } from '../../../../../../model/shared-models/chat-core/agent-configuration.model';

@Component({
  selector: 'app-chatting-job-list',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    ChatJobOrderControlComponent
  ],
  templateUrl: './chatting-job-list.component.html',
  styleUrl: './chatting-job-list.component.scss'
})
export class ChattingJobListComponent extends ComponentBase {
  dragOverIndex: number | null = null;
  draggedJobIndex: number | null = null;

  constructor(
    readonly chattingService: ChattingService,
    readonly chatRoomService: ChatRoomsService,
    readonly chatJobsService: ChatJobsService,
    readonly apiClient: ClientApiService,
    readonly agentConfigurationService: AgentConfigurationService,
    readonly agentInstanceService: AgentInstanceService,
    readonly linkingService: ChatLinkingService,
    readonly route: ActivatedRoute,
    // These services probably shouldn't be here - we're only setting their values
    //  so that other services can utilize them.   A better plan can could be made.
    readonly agentsService: AgentInstanceService,
    readonly projectService: ProjectsService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.agentsService.selectedChatRoomId = params['chatRoomId'];
      this.chatRoomService.selectedChatRoomId = params['chatRoomId'];
      this.projectService.currentProjectId = params['projectId'];
    });

    this.linkingService.jobLinks$.pipe(
      combineLatestWith(this.chatRoomService.selectedChatRoomJobInstances$),
      takeUntil(this.ngDestroy$)
    ).subscribe(([links, roomJobs]) => {

      this.jobs = roomJobs.map(rj => links.find(l => l.jobInstance.id === rj.id))
        .filter(l => !!l)
        .map(l => new JobWrapper(l, this.apiClient));
    });
  }

  /** The jobs to present in the component. */
  jobs: JobWrapper[] = [];

  async setJobDisabled(job: JobWrapper): Promise<void> {
    await this.chatRoomService.setDisabledChatRoomJob(job.jobLink.jobInstance.id, !job.isEnabled);
  }

  onJobInstanceDragStart(event: DragEvent, job: JobWrapper, index: number) {
    this.draggedJobIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('jobInstanceId', job.jobLink.jobInstance.id);
      event.dataTransfer.setData('jobIndex', index.toString());
    }
  }

  onJobInstanceDragEnd(event: DragEvent, job: JobWrapper, index: number) {
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

  onJobInstanceDragOver(event: DragEvent, job: JobWrapper, index: number) {
    event.preventDefault();
    this.dragOverIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  async onJobInstanceDrop(event: DragEvent, job: JobWrapper, index: number) {
    event.preventDefault();
    const jobIndexStr = event.dataTransfer?.getData('jobIndex');
    const jobInstanceId = event.dataTransfer?.getData('jobInstanceId');
    if (jobInstanceId && typeof jobIndexStr === 'string') {
      const fromIndex = parseInt(jobIndexStr, 10);
      if (fromIndex !== index) {
        await this.chatRoomService.setChatJobOrder(jobInstanceId, index);
        this.chatRoomService.reloadSelectedChatRoom();
      }
    }
    this.draggedJobIndex = null;
    this.dragOverIndex = null;
  }
}

export class JobWrapper {
  constructor(
    readonly jobLink: ChatJobLink,
    readonly apiClient: ClientApiService,
  ) {
    // Set the instruction wrappers.
    this.baseInstructions = this.jobLink.agent?.identity?.baseInstructions.map((bi, i) => new InstructionWrapper(
      bi,
      this.apiClient,
      undefined,
      this.jobLink.agent?.identity!,
      'instruction',
      i,
    )) ?? [];

    this.identityInstructions = this.jobLink.agent?.identity?.identityStatements.map((bi, i) => new InstructionWrapper(
      bi,
      this.apiClient,
      undefined,
      this.jobLink.agent?.identity!,
      'identity',
      i,
    )) ?? [];

    this.jobInstructions = this.jobLink.jobConfiguration?.instructions.map((ji, i) => new InstructionWrapper(
      ji,
      this.apiClient,
      this.jobLink.jobConfiguration!._id,
      undefined,
      'job-instruction',
      i
    )) ?? [];

  }

  get configuration() {
    return this.jobLink.jobConfiguration;
  }

  get agent() {
    return this.jobLink.agent?.identity;
  }

  jobInstructions: InstructionWrapper[];

  identityInstructions: InstructionWrapper[];

  baseInstructions: InstructionWrapper[];

  get isEnabled(): boolean {
    return !this.jobLink.jobInstance.disabled;
  }
  set isEnabled(value: boolean) {
    this.jobLink.jobInstance.disabled = !value;
  }
}

export class InstructionWrapper {
  constructor(
    readonly message: PositionableMessage<StoredMessage>,
    readonly apiClient: ClientApiService,
    readonly jobId: ObjectId | undefined,
    readonly agent: ChatAgentIdentityConfiguration | undefined,
    readonly messageType: 'identity' | 'instruction' | 'job-instruction',
    readonly messageIndex: number,
  ) {

  }

  get agentId() {
    return this.agent?._id ?? '';
  }

  /** Gets or sets a boolean value indicating whether or not this instruction is enabled.
   *   This will update the server as well. */
  get isEnabled(): boolean {
    return !isMessageDisabled(this.message.message);
  }
  set isEnabled(value: boolean) {
    // Set the local value.
    setMessageDisabledValue(this.message.message, !value);

    if (this.messageType === 'job-instruction') {
      this.apiClient.setJobInstructionDisabled(this.jobId!, this.messageIndex, !value).subscribe();
    } else {
      // Update the value on the server.
      this.apiClient.setAgentConfigurationMessageDisabled(this.agentId, this.messageType, this.messageIndex, !value).subscribe(() => { });
    }
  }

  get title(): string {
    return this.message.description ||
      this.message.message.data.content.substring(0, 15);
  }
}