import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, of, startWith, switchMap } from 'rxjs';
import { ClientApiService } from './api-client.service';
import { ObjectId } from 'mongodb';
import { ChatRoomData } from '../../../model/shared-models/chat-core/chat-room-data.model';
import { ProjectsService } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomsService {
  constructor(
    private readonly apiClient: ClientApiService,
    private readonly projectService: ProjectsService,
  ) {
    this.initialize();
  }

  private _reloadRooms = new Subject<void>();

  reloadChatRooms() {
    this._reloadRooms.next();
  }

  // New chatRooms$ property as Observable
  chatRooms$: Observable<ChatRoomData[]> = this._reloadRooms.pipe(
    startWith(undefined),
    switchMap(() => {
      return this.projectService.currentProjectId$.pipe(
        switchMap(projectId => {
          if (!projectId) {
            return of([]);
          }
          return this.apiClient.getChatRoomsForProject(projectId);
        })
      );
    })
  );

  private _selectedChatRoomId = new BehaviorSubject<ObjectId | undefined>(undefined);
  private _reloadSelectedChatRoom = new Subject<void>();

  initialize() {
    this.selectedChatRoom$ = this._selectedChatRoomId.asObservable().pipe(
      switchMap((id) => {
        if (!id) {
          return of(undefined);
        }

        return this._reloadSelectedChatRoom.pipe(
          startWith(undefined),
          switchMap(() => {
            return this.apiClient.getChatRoomById(id);
          })
        );
      }));

  }

  // Selected chat room
  selectedChatRoom$!: Observable<ChatRoomData | undefined>;

  private _selectedChatRoom: ChatRoomData | undefined = undefined;
  get selectedChatRoom(): ChatRoomData | undefined {
    return this._selectedChatRoom;
  }

  get selectedChatRoomId(): ObjectId | undefined {
    return this._selectedChatRoomId.value;
  }
  set selectedChatRoomId(id: ObjectId | undefined) {
    this._selectedChatRoomId.next(id);
  }

  private _reloadAgentInstances = new Subject<void>();

  reloadAgentInstances() {
    this._reloadAgentInstances.next();
  }

  // CRUD operations
  createChatRoom(roomName: string, projectId: ObjectId) {
    return this.apiClient.createChatRoom({ name: roomName, projectId }).pipe(
      switchMap(result => {
        this.reloadChatRooms();
        // result is expected to be the created ChatRoomData object
        return of(result as ChatRoomData);
      })
    );
  }

  updateChatRoom(update: Partial<ChatRoomData> & { _id: ObjectId; }) {
    return this.apiClient.updateChatRoom(update).pipe(
      switchMap(() => {
        this.reloadChatRooms();
        // update returns only success, so we do not return a ChatRoomData here
        return of(undefined);
      })
    );
  }

  reloadSelectedChatRoom() {
  }

  deleteChatRoom(id: ObjectId) {
    return this.apiClient.deleteChatRoom(id).pipe(
      switchMap(() => {
        if (this.selectedChatRoomId && this.selectedChatRoomId.toString() === id.toString()) {
          this.selectedChatRoomId = undefined;
        }
        this.reloadChatRooms();
        return of(undefined);
      })
    );
  }

  // Agent instance operations
  createAgentInstanceForChatRoom(roomId: ObjectId, identityId: ObjectId, agentName: string) {
    return this.apiClient.createAgentInstanceForChatRoom(roomId, identityId, agentName).pipe(
      switchMap(result => {
        this.reloadChatRooms();
        return of(result);
      })
    );
  }

  deleteAgentInstanceFromChatRoom(roomId: ObjectId, agentInstanceId: ObjectId) {
    return this.apiClient.deleteAgentInstanceFromChatRoom(roomId, agentInstanceId).pipe(
      switchMap(result => {
        this.reloadChatRooms();
        return of(result);
      })
    );
  }

  assignAgentToJobInstance(roomId: ObjectId, jobInstanceId: ObjectId, agentInstanceId: ObjectId) {
    return this.apiClient.assignAgentToJobInstance(roomId, jobInstanceId, agentInstanceId).pipe(
      switchMap(result => {
        // Update local selectedChatRoom if job exists
        const chatRoom = this.selectedChatRoom;
        if (chatRoom && chatRoom._id.toString() === roomId.toString()) {
          const job = chatRoom.jobs.find(j => j.id && j.id.toString() === jobInstanceId.toString());
          if (job) {
            job.agentId = agentInstanceId;
          }
        }
        this.reloadChatRooms();
        return of(result);
      })
    );
  }

  removeAgentFromJobInstance(roomId: ObjectId, jobInstanceId: ObjectId) {
    return this.apiClient.removeAgentFromJobInstance(roomId, jobInstanceId).pipe(
      switchMap(result => {
        // Update local selectedChatRoom if job exists
        const chatRoom = this.selectedChatRoom;
        if (chatRoom && chatRoom._id.toString() === roomId.toString()) {
          const job = chatRoom.jobs.find(j => j.id && j.id.toString() === jobInstanceId.toString());
          if (job) {
            job.agentId = undefined;
          }
        }
        this.reloadChatRooms();
        return of(result);
      })
    );
  }
}
