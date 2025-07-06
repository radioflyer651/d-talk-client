import { Subject, BehaviorSubject, of, startWith, switchMap, distinctUntilChanged } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { AgentInstanceConfiguration } from '../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ClientApiService } from './api-client.service';
import { ObjectId } from 'mongodb';
import { ReadonlySubject } from '../../../utils/readonly-subject';
import { NewDbItem } from '../../../model/shared-models/db-operation-types.model';
import { ChatRoomsService } from './chat-rooms.service';

@Injectable({
  providedIn: 'root'
})
export class AgentInstanceService implements OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly apiClient: ClientApiService,
    private readonly chatRoomsService: ChatRoomsService
  ) {
    this.initialize();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _reloadAgentInstances = new Subject<void>();

  reloadAgentInstances() {
    this._reloadAgentInstances.next();
  }

  private _agentInstances!: ReadonlySubject<AgentInstanceConfiguration[]>;
  private _selectedAgentInstance!: ReadonlySubject<AgentInstanceConfiguration | undefined>;
  private _selectedAgentInstanceId = new BehaviorSubject<ObjectId | undefined>(undefined);

  initialize() {
    // Use the private _selectedChatRoomId subject from ChatRoomsService for reactivity
    const selectedChatRoomId$ = (this.chatRoomsService as any)._selectedChatRoomId as BehaviorSubject<ObjectId | undefined>;
    this._agentInstances = new ReadonlySubject<AgentInstanceConfiguration[]>(
      this._destroy$,
      selectedChatRoomId$.pipe(
        switchMap(chatRoomId => {
          if (!chatRoomId) return of([]);
          return this._reloadAgentInstances.pipe(
            startWith(undefined),
            switchMap(() => this.apiClient.getAgentInstancesForChatRoom(chatRoomId))
          );
        }),
        startWith([])
      )
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
  get agentInstances$() {
    return this._agentInstances.observable$;
  }
  get agentInstances(): AgentInstanceConfiguration[] {
    return this._agentInstances.value;
  }

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
    const chatRoomId = this.chatRoomsService.selectedChatRoomId;
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
