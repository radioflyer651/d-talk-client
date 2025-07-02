import { Injectable } from '@angular/core';
import { ClientApiService as ApiClientService } from './api-client.service';
import { BehaviorSubject, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { Project } from '../../model/shared-models/chat-core/project.model';
import { ProjectListing } from '../../model/shared-models/chat-core/project-listing.model';
import { ReadonlySubject } from '../../utils/readonly-subject';
import { BaseComponent } from 'primeng/basecomponent';
import { ComponentBase } from '../components/component-base/component-base.component';
import { ObjectId } from 'mongodb';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends ComponentBase {
  constructor(
    readonly client: ApiClientService
  ) {
    super();

    this.initialize();
  }

  reloadProjectList = new Subject<void>();

  initialize() {
    this._projectListing = new ReadonlySubject<ProjectListing[]>(this.ngDestroy$,
      this.reloadProjectList.pipe(
        startWith(undefined),
        switchMap(() => {
          return this.client.getProjectListings();
        })
      )
    );

    this._currentProject = new ReadonlySubject<Project | undefined>(this.ngDestroy$,
      this.currentProjectId$.pipe(
        switchMap(id => {
          if (!id) {
            return of(undefined);
          }

          return this.client.getProjectById(id);
        })
      )
    );
  }

  // #region projectListing
  private _projectListing!: ReadonlySubject<ProjectListing[]>;

  get projectListing$() {
    return this._projectListing.observable$;
  }

  get projectListing(): ProjectListing[] {
    return this._projectListing.value;
  }
  // #endregion


  // #region currentProjectId
  private readonly _currentProjectId = new BehaviorSubject<ObjectId | undefined>(undefined);
  readonly currentProjectId$ = this._currentProjectId.asObservable();

  /** Gets or sets the current project that the application is working with. */
  get currentProjectId(): ObjectId | undefined {
    return this._currentProjectId.getValue();
  }

  set currentProjectId(newVal: ObjectId | undefined) {
    this._currentProjectId.next(newVal);
  }
  // #endregion

  // #region currentProject
  private _currentProject!: ReadonlySubject<Project | undefined>;

  get currentProject$() {
    return this._currentProject.observable$;
  }

  get currentProject(): Project | undefined {
    return this._currentProject.value;
  }
  // #endregion

  /**
   * Creates a new project with the given name and reloads the project list on success.
   */
  createProject(name: string) {
    return this.client.createProject(name).pipe(
      // On success, trigger a reload of the project list
      switchMap(result => {
        this.reloadProjectList.next();
        return of(result);
      })
    );
  }

  /**
   * Deletes a project by its ID, updates the project list, and clears currentProjectId if it was deleted.
   */
  deleteProject(id: ObjectId) {
    return this.client.deleteProject(id).pipe(
      switchMap(result => {
        // If the deleted project is the current one, clear it
        if (this.currentProjectId && this.currentProjectId === id.toString()) {
          this.currentProjectId = undefined;
        }
        this.reloadProjectList.next();
        return of(result);
      })
    );
  }
}
