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

  constructor(private readonly apiClient: ClientApiService) { }

  reloadConfigs() {
    this._reloadConfigs.next();
  }

  // Observable for all configs
  get configs$(): Observable<OllamaModelConfiguration[]> {
    return this._reloadConfigs.pipe(
      startWith(undefined),
      switchMap(() => this.apiClient.getOllamaModelConfigurations()),
      startWith([])
    );
  }

  // Observable for selected config
  get selectedConfig$(): Observable<OllamaModelConfiguration | undefined> {
    return this._selectedConfigId.asObservable().pipe(
      switchMap((id) => {
        if (!id) {
          return of(undefined);
        }
        
        return this.apiClient.getOllamaModelConfigurationById(id);
      })
    );
  }

  get selectedConfigId(): ObjectId | undefined {
    return this._selectedConfigId.value;
  }
  set selectedConfigId(id: ObjectId | undefined) {
    this._selectedConfigId.next(id);
  }

  // CRUD operations
  createConfig(config: NewDbItem<OllamaModelConfiguration>) {
    return this.apiClient.createOllamaModelConfiguration(config).pipe(
      switchMap(result => {
        this.reloadConfigs();
        return of(result);
      })
    );
  }

  updateConfig(update: Partial<OllamaModelConfiguration> & { _id: ObjectId; }) {
    return this.apiClient.updateOllamaModelConfiguration(update).pipe(
      switchMap(result => {
        this.reloadConfigs();
        return of(result);
      })
    );
  }

  deleteConfig(id: ObjectId) {
    return this.apiClient.deleteOllamaModelConfiguration(id).pipe(
      switchMap(result => {
        if (this.selectedConfigId && this.selectedConfigId.toString() === id.toString()) {
          this.selectedConfigId = undefined;
        }
        this.reloadConfigs();
        return of(result);
      })
    );
  }

  /**
   * Returns an observable of all Ollama model configurations, always up-to-date with reloads.
   */
  getAllConfigs$(): Observable<OllamaModelConfiguration[]> {
    return this._reloadConfigs.pipe(
      startWith(undefined),
      switchMap(() => this.apiClient.getOllamaModelConfigurations()),
      startWith([])
    );
  }
}
