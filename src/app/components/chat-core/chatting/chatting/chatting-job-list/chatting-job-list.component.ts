import { Component } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { ChattingService } from '../../../../../services/chat-core/chatting.service';
import { ChatRoomsService } from '../../../../../services/chat-core/chat-rooms.service';
import { ChatJobsService } from '../../../../../services/chat-core/chat-jobs.service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChatJobInstance } from '../../../../../../model/shared-models/chat-core/chat-job-instance.model';
import { LinkedJobInstance } from '../../../../../../model/linked-job-instance.model';
import { AgentInstanceService } from '../../../../../services/chat-core/agent-instance.service';
import { ProjectsService } from '../../../../../services/chat-core/projects.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatting-job-list',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
  ],
  templateUrl: './chatting-job-list.component.html',
  styleUrl: './chatting-job-list.component.scss'
})
export class ChattingJobListComponent extends ComponentBase {
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


}
