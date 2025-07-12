import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { PositionableMessage } from '../../../../../model/shared-models/chat-core/positionable-message.model';
import { StoredMessage } from '@langchain/core/messages';
import { lastValueFrom, takeUntil } from 'rxjs';
import { ProjectListComponent } from "../project-list/project-list.component";
import { PositionableMessageListComponent } from "../../positionable-messages/positionable-message-list/positionable-message-list.component";
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ClientApiService } from '../../../../services/chat-core/api-clients/api-client.service';
import { Project } from '../../../../../model/shared-models/chat-core/project.model';

@Component({
  selector: 'app-project-knowledge',
  imports: [
    PositionableMessageListComponent,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './project-knowledge.component.html',
  styleUrl: './project-knowledge.component.scss'
})
export class ProjectKnowledgeComponent extends ComponentBase {
  constructor(
    readonly projectService: ProjectsService,
    readonly apiClient: ClientApiService,
  ) {
    super();
  }

  ngOnInit() {
    this.projectService.currentProject$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(project => {
      this.project = project;

      if (!project) {
        return;
      }

      if (!project.projectKnowledge) {
        project.projectKnowledge = [];
      }
    });
  }

  project?: Project;

  async saveProject() {
    await lastValueFrom(this.apiClient.updateProject(this.project!._id, this.project!));
    await this.projectService.reloadProjectList();
  }
}
