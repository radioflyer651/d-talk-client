import { Subject, BehaviorSubject, of, startWith, switchMap, distinctUntilChanged, Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { AgentInstanceConfiguration } from '../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ClientApiService } from './api-clients/api-client.service';
import { ObjectId } from 'mongodb';
import { ReadonlySubject } from '../../../utils/readonly-subject';
import { NewDbItem } from '../../../model/shared-models/db-operation-types.model';
import { ChatRoomsService } from './chat-rooms.service';

@Injectable({
  providedIn: 'root'
})
export class AgentInstanceService {
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly apiClient: ClientApiService,
  ) {
    this.initialize();
  }

  private _reloadAgentInstances = new Subject<void>();

  reloadAgentInstances() {
    this._reloadAgentInstances.next();
  }

  private _selectedAgentInstance!: ReadonlySubject<AgentInstanceConfiguration | undefined>;
  private _selectedAgentInstanceId = new BehaviorSubject<ObjectId | undefined>(undefined);

  // #region selectedChatRoomId
  private readonly _selectedChatRoomId = new BehaviorSubject<ObjectId | undefined>(undefined);
  readonly selectedChatRoomId$ = this._selectedChatRoomId.asObservable();

  get selectedChatRoomId(): ObjectId | undefined {
    return this._selectedChatRoomId.getValue();
  }

  set selectedChatRoomId(newVal: ObjectId | undefined) {
    this._selectedChatRoomId.next(newVal);
  }
  // #endregion

  initialize() {
    // Use the private _selectedChatRoomId subject from ChatRoomsService for reactivity
    this.agentInstances$ = this.selectedChatRoomId$.pipe(
      switchMap(chatRoomId => {
        if (!chatRoomId) {
          return of([]);
        }


        return this._reloadAgentInstances.pipe(
          startWith(undefined),
          switchMap(() => this.apiClient.getAgentInstancesForChatRoom(chatRoomId))
        );
      }),
      startWith([] as AgentInstanceConfiguration[])
    );

    this._selectedAgentInstance = new ReadonlySubject<AgentInstanceConfiguration | undefined>(
      this._destroy$,
      this._selectedAgentInstanceId.asObservable().pipe(
        switchMap((id) => {
          if (!id) return of(undefined);
          return this.apiClient.getAgentInstanceById(id);
        })
      )
    );
  }

  // List all agent instances for the selected chat room
  agentInstances$!: Observable<AgentInstanceConfiguration[]>;

  // Selected agent instance
  get selectedAgentInstance$() {
    return this._selectedAgentInstance.observable$;
  }
  get selectedAgentInstance(): AgentInstanceConfiguration | undefined {
    return this._selectedAgentInstance.value;
  }
  get selectedAgentInstanceId(): ObjectId | undefined {
    return this._selectedAgentInstanceId.value;
  }
  set selectedAgentInstanceId(id: ObjectId | undefined) {
    this._selectedAgentInstanceId.next(id);
  }

  // CRUD operations
  createAgentInstance(instance: NewDbItem<AgentInstanceConfiguration>) {
    const chatRoomId = this.selectedChatRoomId;
    if (!chatRoomId) {
      return of(undefined);
    }

    // The API expects a full AgentInstanceConfiguration object
    return this.apiClient.createAgentInstance(instance as AgentInstanceConfiguration).pipe(
      switchMap(result => {
        this.reloadAgentInstances();
        return of(result);
      })
    );
  }

  updateAgentInstance(instance: AgentInstanceConfiguration) {
    return this.apiClient.updateAgentInstance(instance).pipe(
      switchMap(result => {
        this.reloadAgentInstances();
        return of(result);
      })
    );
  }

  deleteAgentInstance(id: ObjectId) {
    return this.apiClient.deleteAgentInstance(id).pipe(
      switchMap(result => {
        if (this.selectedAgentInstanceId && this.selectedAgentInstanceId.toString() === id.toString()) {
          this.selectedAgentInstanceId = undefined;
        }
        this.reloadAgentInstances();
        return of(result);
      })
    );
  }
}
