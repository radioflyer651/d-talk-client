import { Component } from '@angular/core';
import { ProjectListComponent } from "./project-list/project-list.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../../services/chat-core/projects.service';
import { ComponentBase } from '../../component-base/component-base.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { CurrentRouteParamsService } from '../../../services/current-route-params.service';

@Component({
  selector: 'app-projects',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProjectListComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent extends ComponentBase {
  constructor(
    readonly projectsService: ProjectsService,
    readonly route: ActivatedRoute,
    readonly currentRouteParamsService: CurrentRouteParamsService,
  ) {
    super();
  }

  ngOnInit() {

    this.currentRouteParamsService.params$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.projectsService.currentProjectId = params['projectId'];
    });

    this.projectsService.currentProject$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(project => {
      this._hasProject = !!project;
    });
  }

  _hasProject: boolean = false;
  get hasProject(): boolean {
    return this._hasProject;
  }
}
