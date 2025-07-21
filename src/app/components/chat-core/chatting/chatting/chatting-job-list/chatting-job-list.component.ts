import { Component } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { ChattingService } from '../../../../../services/chat-core/chatting.service';
import { ChatRoomsService } from '../../../../../services/chat-core/chat-rooms.service';
import { ChatJobsService } from '../../../../../services/chat-core/chat-jobs.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChatJobInstance } from '../../../../../../model/shared-models/chat-core/chat-job-instance.model';
import { AgentInstanceService } from '../../../../../services/chat-core/agent-instance.service';
import { ProjectsService } from '../../../../../services/chat-core/projects.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ChatJobOrderControlComponent } from "../../../chat-job-order-control/chat-job-order-control.component";

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
  }

  async setJobDisabled(job: ChatJobInstance): Promise<void> {
    await this.chatRoomService.setDisabledChatRoomJob(job.id, job.disabled);
  }

  onJobInstanceDragStart(event: DragEvent, job: ChatJobInstance, index: number) {
    this.draggedJobIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('jobInstanceId', job.id);
      event.dataTransfer.setData('jobIndex', index.toString());
    }
  }

  onJobInstanceDragEnd(event: DragEvent, job: ChatJobInstance, index: number) {
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

  onJobInstanceDragOver(event: DragEvent, job: ChatJobInstance, index: number) {
    event.preventDefault();
    this.dragOverIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  async onJobInstanceDrop(event: DragEvent, job: ChatJobInstance, index: number) {
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
