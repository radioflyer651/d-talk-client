import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of, startWith, switchMap } from 'rxjs';
import { ClientApiService } from './api-clients/api-client.service';
import { ObjectId } from 'mongodb';
import { OllamaModelConfiguration } from '../../../model/shared-models/chat-core/chat-model-params/ollama.model-params';
import { NewDbItem } from '../../../model/shared-models/db-operation-types.model';

@Injectable({
  providedIn: 'root'
})
export class OllamaConfigurationService {
  private _reloadConfigs = new Subject<void>();
  private _selectedConfigId = new BehaviorSubject<ObjectId | undefined>(undefined);

  constructor(private readonly apiClient: ClientApiService) {
    this.initialize();
  }

  reloadConfigs() {
    this._reloadConfigs.next();
  }

  private initialize() {
    this.allConfigurations$ = this._reloadConfigs.pipe(
      startWith(undefined),
      switchMap(() => this.apiClient.getOllamaModelConfigurations()),
      startWith([])
    );
  }

  // Observable for all configs
  allConfigurations$!: Observable<OllamaModelConfiguration[]>;

  // CRUD operations
  createConfiguration(config: NewDbItem<OllamaModelConfiguration>) {
    return this.apiClient.createOllamaModelConfiguration(config).pipe(
      switchMap(result => {
        this.reloadConfigs();
        return of(result);
      })
    );
  }

  updateConfiguration(update: Partial<OllamaModelConfiguration> & { _id: ObjectId; }) {
    return this.apiClient.updateOllamaModelConfiguration(update).pipe(
      switchMap(result => {
        this.reloadConfigs();
        return of(result);
      })
    );
  }

  deleteConfiguration(id: ObjectId) {
    return this.apiClient.deleteOllamaModelConfiguration(id).pipe(
      switchMap(result => {
        this.reloadConfigs();
        return of(result);
      })
    );
  }

  /**
   * Returns an observable of all Ollama model configurations, always up-to-date with reloads.
   */
  getAllConfigurations$(): Observable<OllamaModelConfiguration[]> {
    return this._reloadConfigs.pipe(
      startWith(undefined),
      switchMap(() => this.apiClient.getOllamaModelConfigurations()),
      startWith([])
    );
  }
}
