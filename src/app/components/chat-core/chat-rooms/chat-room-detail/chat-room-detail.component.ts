import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatJobsService } from '../../../../services/chat-core/chat-jobs.service';
import { AgentConfigurationService } from '../../../../services/chat-core/agent-configuration.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';

@Component({
  selector: 'app-chat-room-detail',
  imports: [],
  templateUrl: './chat-room-detail.component.html',
  styleUrl: './chat-room-detail.component.scss'
})
export class ChatRoomDetailComponent extends ComponentBase {
  constructor(
    readonly chatJobsService: ChatJobsService,
    readonly chatAgentService: AgentConfigurationService,
    readonly projectService: ProjectsService,
    readonly chatRoomService: ChatRoomsService,
  ) {
    super();
  }

  ngOnInit() {
    
  }
}
