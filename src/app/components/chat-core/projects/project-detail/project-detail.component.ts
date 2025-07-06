import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { filter, lastValueFrom, startWith, takeUntil, takeWhile } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ComponentBase } from '../../../component-base/component-base.component';
import { Project } from '../../../../../model/shared-models/chat-core/project.model';
import { ClientApiService } from '../../../../services/chat-core/api-client.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { AgentConfigurationsComponent } from "../../agent-configurations/agent-configurations.component";
import { ChatJobListComponent } from "../../chat-jobs/chat-job-list/chat-job-list.component";
import { ChatJobsComponent } from "../../chat-jobs/chat-jobs.component";
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CurrentRouteParamsService } from '../../../../services/current-route-params.service';
import { DummyScreenComponent } from "../../../dummy-screen/dummy-screen.component";

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
    AgentConfigurationsComponent,
    ChatJobListComponent,
    ChatJobsComponent,
    RouterModule,
    DummyScreenComponent
  ],
  providers: [
    CurrentRouteParamsService
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent extends ComponentBase {
  constructor(
    readonly projectsService: ProjectsService,
    readonly apiClient: ClientApiService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly currentParmsService: CurrentRouteParamsService,
  ) {
    super();
  }

  selectedTab = 'overview';

  tabClicked(tabId: string) {
    this.router.navigate(['/projects', this.projectsService.currentProjectId, tabId]);
  }

  ngOnInit() {
    this.router.events.pipe(
      takeUntil(this.ngDestroy$),
      filter(e => e instanceof NavigationEnd),
      startWith(undefined)
    ).subscribe((e: any) => {
      // For easy access.
      const firstChild = this.route.firstChild;
      if (!firstChild) {
        return;
      }

      // Get the path.  See what it is.
      const currentPath = firstChild.routeConfig?.path;
      if (!currentPath) {
        return;
      }

      // If we have a param, then deal with that.  Otherwise, deal with the constant.
      if (currentPath?.startsWith(':')) {
        const tabId = firstChild.snapshot.params['tabId'];
        this.selectedTab = tabId ?? 'overview';
      } else {
        console.log(`Naving2: ${currentPath}`);
        this.selectedTab = currentPath ?? 'overview';
      }

    });


    this.route.params.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.projectsService.currentProjectId = params['projectId'];
    });

    // The tab params don't exist at this level of the routes, so we need
    //  to handle them specially with the CurrentRouteParamsService.
    // this.currentParmsService.params$.pipe(
    //   takeUntil(this.ngDestroy$)
    // ).subscribe(params => {
    //   this.selectedTab = params['tabId'] ?? 'overview';
    // });

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
