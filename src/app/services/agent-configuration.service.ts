import { Subject, BehaviorSubject, of, startWith, switchMap } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ChatAgentIdentityConfiguration } from '../../model/shared-models/chat-core/agent-configuration.model';
import { ProjectsService } from './projects.service';
import { ClientApiService } from './api-client.service';
import { ObjectId } from 'mongodb';
import { ReadonlySubject } from '../../utils/readonly-subject';

@Injectable({
  providedIn: 'root'
})
export class AgentConfigurationService implements OnDestroy {
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

  private _reloadAgentConfigs = new Subject<void>();

  reloadAgentConfigurations() {
    this._reloadAgentConfigs.next();
  }

  private _agentConfigurations!: ReadonlySubject<ChatAgentIdentityConfiguration[]>;
  private _selectedAgentConfig!: ReadonlySubject<ChatAgentIdentityConfiguration | undefined>;
  private _selectedAgentConfigId = new BehaviorSubject<ObjectId | undefined>(undefined);

  initialize() {
    this._agentConfigurations = new ReadonlySubject<ChatAgentIdentityConfiguration[]>(
      this._destroy$,
      this.projectService.currentProjectId$.pipe(
        switchMap(projectId => {
          if (!projectId) {
            return of([]);
          }
          return this._reloadAgentConfigs.pipe(
            startWith(undefined),
            switchMap(() => this.apiClient.getAgentConfigurations(projectId))
          );
        }),
        startWith([])
      )
    );

    this._selectedAgentConfig = new ReadonlySubject<ChatAgentIdentityConfiguration | undefined>(
      this._destroy$,
      this._selectedAgentConfigId.asObservable().pipe(
        switchMap(id => {
          if (!id) {
            return of(undefined);
          }
          return this.apiClient.getAgentConfigurationById(id);
        })
      )
    );
  }

  // List all agent configurations for the current project
  get agentConfigurations$() {
    return this._agentConfigurations.observable$;
  }
  get agentConfigurations(): ChatAgentIdentityConfiguration[] {
    return this._agentConfigurations.value;
  }

  // Selected agent configuration
  get selectedAgentConfig$() {
    return this._selectedAgentConfig.observable$;
  }
  get selectedAgentConfig(): ChatAgentIdentityConfiguration | undefined {
    return this._selectedAgentConfig.value;
  }
  get selectedAgentConfigId(): ObjectId | undefined {
    return this._selectedAgentConfigId.value;
  }
  set selectedAgentConfigId(id: ObjectId | undefined) {
    this._selectedAgentConfigId.next(id);
  }

  // CRUD operations
  createAgentConfiguration(config: ChatAgentIdentityConfiguration) {
    const projectId = this.projectService.currentProjectId;
    if (!projectId) {
      return of(undefined);
    }
    return this.apiClient.createAgentConfiguration(projectId, config).pipe(
      switchMap(result => {
        this.reloadAgentConfigurations();
        return of(result);
      })
    );
  }

  updateAgentConfiguration(id: ObjectId, config: ChatAgentIdentityConfiguration) {
    return this.apiClient.updateAgentConfiguration(id, config).pipe(
      switchMap(result => {
        this.reloadAgentConfigurations();
        return of(result);
      })
    );
  }

  deleteAgentConfiguration(id: ObjectId) {
    return this.apiClient.deleteAgentConfiguration(id).pipe(
      switchMap(result => {
        if (this.selectedAgentConfigId && this.selectedAgentConfigId.toString() === id.toString()) {
          this.selectedAgentConfigId = undefined;
        }
        this.reloadAgentConfigurations();
        return of(result);
      })
    );
  }
}
