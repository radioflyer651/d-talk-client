import { Subject, BehaviorSubject, of, startWith, switchMap, distinctUntilChanged, takeUntil } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ChatAgentIdentityConfiguration } from '../../../model/shared-models/chat-core/agent-configuration.model';
import { ProjectsService } from './projects.service';
import { ClientApiService } from './api-clients/api-client.service';
import { ObjectId } from 'mongodb';
// import { ReadonlySubject } from '../../../utils/readonly-subject';
import { NewDbItem } from '../../../model/shared-models/db-operation-types.model';

@Injectable({
  providedIn: 'root'
})
export class AgentConfigurationService {
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly apiClient: ClientApiService,
    private readonly projectService: ProjectsService,
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

  private _agentConfigurations$!: ReturnType<typeof this.createAgentConfigurations$>;
  private _agentConfigurationsValue: ChatAgentIdentityConfiguration[] = [];
  private _selectedAgentConfig$!: ReturnType<typeof this.createSelectedAgentConfig$>;
  private _selectedAgentConfigValue: ChatAgentIdentityConfiguration | undefined;
  private _selectedAgentConfigId = new BehaviorSubject<ObjectId | undefined>(undefined);

  private createAgentConfigurations$() {
    return this.projectService.currentProjectId$.pipe(
      switchMap(projectId => {
        if (!projectId) {
          return of([]);
        }
        return this._reloadAgentConfigs.pipe(
          startWith(undefined),
          switchMap(() => this.apiClient.getAgentConfigurations(projectId))
        );
      }),
      startWith([]),
      distinctUntilChanged()
    );
  }

  private createSelectedAgentConfig$() {
    return this._selectedAgentConfigId.asObservable().pipe(
      switchMap((id) => {
        if (!id) {
          return of(undefined);
        }
        return this.apiClient.getAgentConfigurationById(id);
      }),
      distinctUntilChanged()
    );
  }

  initialize() {
    // Agent Configurations observable and value
    this._agentConfigurations$ = this.createAgentConfigurations$();
    this._agentConfigurations$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(configs => {
        this._agentConfigurationsValue = configs;
      });

    // Selected Agent Config observable and value
    this._selectedAgentConfig$ = this.createSelectedAgentConfig$();
    this._selectedAgentConfig$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(config => {
        this._selectedAgentConfigValue = config;
      });
  }

  // List all agent configurations for the current project
  get agentConfigurations$() {
    return this._agentConfigurations$;
  }
  get agentConfigurations(): ChatAgentIdentityConfiguration[] {
    return this._agentConfigurationsValue;
  }

  // Selected agent configuration
  get selectedAgentConfig$() {
    return this._selectedAgentConfig$;
  }
  get selectedAgentConfig(): ChatAgentIdentityConfiguration | undefined {
    return this._selectedAgentConfigValue;
  }
  get selectedAgentConfigId(): ObjectId | undefined {
    return this._selectedAgentConfigId.value;
  }
  set selectedAgentConfigId(id: ObjectId | undefined) {
    this._selectedAgentConfigId.next(id);
  }

  // CRUD operations
  createAgentConfiguration(config: NewDbItem<ChatAgentIdentityConfiguration>) {
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

  updateAgentConfiguration(config: ChatAgentIdentityConfiguration) {
    return this.apiClient.updateAgentConfiguration(config).pipe(
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
