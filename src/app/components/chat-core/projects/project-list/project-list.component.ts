import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, lastValueFrom, map, Subscription, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ProjectListing } from '../../../../../model/shared-models/chat-core/project-listing.model';
import { takeUntil } from 'rxjs';
import { MessagingService } from '../../../../services/messaging.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ComponentBase } from '../../../component-base/component-base.component';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-project-list',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    CardModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    DataViewModule,
    ConfirmDialogModule,
    DialogModule,
    FloatLabelModule,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent extends ComponentBase {
  constructor(
    readonly projectsService: ProjectsService,
    readonly confirmationService: ConfirmationService,
    readonly messagingService: MessagingService,
    readonly sanitizer: DomSanitizer,
  ) {
    super();
  }


  ngOnInit() {
    // Create an observable that completes when ngDestroy$ emits, and updates the value property.
    this._projectList$ = this.projectsService.projectListing$
      .pipe(takeUntil(this.ngDestroy$));

    // Subscribe to keep the latest value in _projectListValue
    this._projectList$.subscribe(list => {
      list.sort((a, b) => a.name.localeCompare(b.name));
      this._projectListValue = list;
    });
  }

  // #region projectList
  private _projectList$!: import('rxjs').Observable<ProjectListing[]>;
  private _projectListValue: ProjectListing[] = [];

  get projectList$() {
    return this._projectList$;
  }

  get projectList(): ProjectListing[] {
    return this._projectListValue;
  }
  // #endregion

  async deleteProject(project: ProjectListing): Promise<void> {
    this.confirmationService.confirm({
      message: `Are you sure you wish to delete the ${project.name} project?`,
      accept: async () => {
        return await lastValueFrom(this.projectsService.deleteProject(project._id));
      }
    });
  }

  selectProject(project: ProjectListing) {
    // this.projectsService.currentProjectId = project._id;
  }

  isNewProjectDialogVisible: boolean = false;

  createNewProject() {
    // Show the new project dialog.
    this.isNewProjectDialogVisible = true;
  }

  /** The field used to create a new project.  This is the name the user enters. */
  newProjectName: string = '';

  /** Called by the Create New Project dialog when OK or Cancel is clicked. */
  async onNeProjectComplete(cancelled: boolean): Promise<void> {
    this.isNewProjectDialogVisible = false;

    // Exit if they cancelled.
    if (cancelled) {
      return;
    }

    // Validate the name.
    if (!this.newProjectName.trim()) {
      this.messagingService.sendUserMessage({
        level: 'error',
        content: 'A valid name must be provided to create a new project.'
      });

      return;
    }

    // Create the project.
    const newProject = await lastValueFrom(this.projectsService.createProject(this.newProjectName));

    // Set this as the current project.
    // this.projectsService.currentProjectId = newProject._id;
  }

  getProjectDescription(agent: ProjectListing) {
    const result = this.sanitizer.bypassSecurityTrustHtml(agent.description?.replaceAll('\n', '<br/>') ?? '');
    return result;
  }
}
