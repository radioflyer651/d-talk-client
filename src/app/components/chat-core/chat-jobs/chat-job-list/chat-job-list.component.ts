import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatJobsService } from '../../../../services/chat-core/chat-jobs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ChatJobConfiguration } from '../../../../../model/shared-models/chat-core/chat-job-data.model';
import { ReadonlySubject } from '../../../../../utils/readonly-subject';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-job-list',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    PanelModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
    DataViewModule,
    ConfirmDialogModule,
    DialogModule
  ],
  templateUrl: './chat-job-list.component.html',
  styleUrl: './chat-job-list.component.scss'
})
export class ChatJobListComponent extends ComponentBase {
  constructor(
    readonly jobService: ChatJobsService,
    readonly confirmationService: ConfirmationService,
    readonly projectService: ProjectsService,
    readonly router: Router,
    readonly route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this._jobList = new ReadonlySubject(this.ngDestroy$,
      this.searchText$.pipe(
        switchMap((searchText) => {
          return this.jobService.jobs$.pipe(
            map(jobList => {
              return jobList.filter(j => j.name.toLowerCase().includes(searchText.toLocaleLowerCase()));
            })
          );
        })
      )
    );
  }

  // #region searchText
  private readonly _searchText = new BehaviorSubject<string>('');
  readonly searchText$ = this._searchText.asObservable();

  get searchText(): string {
    return this._searchText.getValue();
  }

  set searchText(newVal: string) {
    this._searchText.next(newVal);
  }
  // #endregion

  // #region jobList
  private _jobList!: ReadonlySubject<ChatJobConfiguration[]>;

  get jobList$() {
    return this._jobList.observable$;
  }

  get jobList(): ChatJobConfiguration[] {
    return this._jobList.value;
  }
  // #endregion

  async deleteJob(job: ChatJobConfiguration): Promise<void> {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: `Are you sure you wish to delete the job '${job.name}'?`,
      accept: async () => {
        return await lastValueFrom(this.jobService.deleteJob(job._id));
      }
    });
  }

  selectJob(job: ChatJobConfiguration) {
    this.router.navigate([job._id], { relativeTo: this.route });
  }

  isNewJobDialogVisible: boolean = false;

  showNewJobDialog() {
    this.newJobName = '';
    this.isNewJobDialogVisible = true;
  }

  newJobName: string = '';

  /**
   * Creates a new job from the dialog input, sends it to the server, and selects it.
   * Handles order assignment and ensures projectId is present.
   */
  async createJobFromDialog() {
    // Trim and validate the job name
    const name = this.newJobName.trim();
    if (!name) return;

    // Find the next order value for the new job
    const jobs = this.jobService.jobs;
    const order = (jobs.length > 0
      ? Math.max(...jobs.map(j => j.order)) + 1
      : 1);

    const projectId = this.projectService.currentProjectId!;

    const newJob = {
      projectId,
      name,
      order,
      disabled: false,
      agentId: undefined,
      instructions: [],
      chatDocumentReferences: [],
      plugins: []
    };

    // Create the job on the server
    const created: any = await lastValueFrom(this.jobService.createJob(newJob));

    // Close the dialog
    this.isNewJobDialogVisible = false;

    // Select the new job if creation was successful
    if (created && created._id) {
      this.router.navigate([created._id], { relativeTo: this.route });
    }
  }

  createNewJob() {
    this.isNewJobDialogVisible = true;
  }
}
