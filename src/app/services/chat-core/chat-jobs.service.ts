import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, of, startWith, switchMap, distinctUntilChanged, lastValueFrom } from 'rxjs';
import { ProjectsService } from './projects.service';
import { ClientApiService } from './api-clients/api-client.service';
import { ObjectId } from 'mongodb';
import { ChatJobConfiguration } from '../../../model/shared-models/chat-core/chat-job-data.model';
import { ReadonlySubject } from '../../../utils/readonly-subject';
import { NewDbItem } from '../../../model/shared-models/db-operation-types.model';

@Injectable({
  providedIn: 'root'
})
export class ChatJobsService implements OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly apiClient: ClientApiService,
    private readonly projectService: ProjectsService
  ) {
    this.initialize();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _reloadJobs = new Subject<void>();

  reloadJobs() {
    this._reloadJobs.next();
  }

  private _jobs!: ReadonlySubject<ChatJobConfiguration[]>;
  private _selectedJob!: ReadonlySubject<ChatJobConfiguration | undefined>;
  private _selectedJobId = new BehaviorSubject<ObjectId | undefined>(undefined);

  initialize() {
    this._jobs = new ReadonlySubject<ChatJobConfiguration[]>(
      this._destroy$,
      this.projectService.currentProjectId$.pipe(
        switchMap(projectId => {
          if (!projectId) {
            return of([]);
          }
          return this._reloadJobs.pipe(
            startWith(undefined),
            switchMap(() => this.apiClient.getJobsForProject(projectId))
          );
        }),
        startWith([])
      )
    );

    // When the project changes, reset the selected job.
    this.projectService.currentProjectId$.pipe(
      distinctUntilChanged()
    ).subscribe(() => {
      this.selectedJobId = undefined;
    });

    this._selectedJob = new ReadonlySubject<ChatJobConfiguration | undefined>(
      this._destroy$,
      this._selectedJobId.asObservable().pipe(
        switchMap((id) => {
          if (!id) {
            return of(undefined);
          }
          return this.apiClient.getJobById(id);
        })
      )
    );
  }

  // List all jobs for the current project
  get jobs$() {
    return this._jobs.observable$;
  }
  get jobs(): ChatJobConfiguration[] {
    return this._jobs.value;
  }

  // Selected job
  get selectedJob$() {
    return this._selectedJob.observable$;
  }
  get selectedJob(): ChatJobConfiguration | undefined {
    return this._selectedJob.value;
  }
  get selectedJobId(): ObjectId | undefined {
    return this._selectedJobId.value;
  }
  set selectedJobId(id: ObjectId | undefined) {
    this._selectedJobId.next(id);
  }

  /** Sets the messages hidden status on a specified job configuration, and updates the value on the server. */
  async setJobMessagesHidden(jobId: ObjectId, messagesHidden: boolean): Promise<void> {
    const job = this.jobs.find(j => j._id === jobId);
    if (!job) {
      throw new Error(`Job not found with ID: ${jobId}`);
    }

    // Update the server.
    await lastValueFrom(this.apiClient.setJobMessagesHidden(jobId, messagesHidden));
  }

  // CRUD operations
  createJob(job: NewDbItem<ChatJobConfiguration>) {
    const projectId = this.projectService.currentProjectId;
    if (!projectId) {
      return of(undefined);
    }
    // The backend expects _id to be omitted for creation, so cast to 'any' to satisfy the API client type
    return this.apiClient.createJob({ ...(job as any), projectId } as any).pipe(
      switchMap(result => {
        this.reloadJobs();
        return of(result);
      })
    );
  }

  updateJob(update: Partial<ChatJobConfiguration> & { _id: ObjectId; }) {
    // projectId is always present in ChatJobConfiguration
    return this.apiClient.updateJob(update).pipe(
      switchMap(result => {
        this.reloadJobs();
        return of(result);
      })
    );
  }

  deleteJob(id: ObjectId) {
    return this.apiClient.deleteJob(id).pipe(
      switchMap(result => {
        if (this.selectedJobId && this.selectedJobId.toString() === id.toString()) {
          this.selectedJobId = undefined;
        }
        this.reloadJobs();
        return of(result);
      })
    );
  }
}
