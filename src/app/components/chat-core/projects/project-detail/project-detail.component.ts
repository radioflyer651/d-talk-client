import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { lastValueFrom, takeUntil } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ComponentBase } from '../../../component-base/component-base.component';
import { Project } from '../../../../../model/shared-models/chat-core/project.model';
import { ClientApiService } from '../../../../services/api-client.service';
import { ProjectsService } from '../../../../services/projects.service';
import { AgentConfigurationsComponent } from "../../agent-configurations/agent-configurations.component";

@Component({
  selector: 'app-project-detail',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    PanelModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    TextareaModule,
    AgentConfigurationsComponent
],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent extends ComponentBase {
  constructor(
    readonly projectsService: ProjectsService,
    readonly apiClient: ClientApiService,
  ) {
    super();
  }

  selectedTab = 0;

  tabClicked(index: number) {
    this.selectedTab = index;
  }

  ngOnInit() {
    this.projectsService.currentProject$.pipe(
      takeUntil(this.ngDestroy$),
    ).subscribe(proj => {
      this.project = proj;
    });
  }

  private _project: Project | undefined = undefined;
  get project(): Project | undefined {
    return this._project;
  }
  set project(value: Project | undefined) {
    this._project = value;
  }

  async saveProject() {
    await lastValueFrom(this.apiClient.updateProject(this.project!._id, this.project!));
    await this.projectsService.reloadProjectList();
  }
}
