import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of, startWith, switchMap, distinctUntilChanged } from 'rxjs';
import { ClientApiService } from './api-client.service';
import { ObjectId } from 'mongodb';
import { ReadonlySubject } from '../../../utils/readonly-subject';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomsService {
  private readonly _destroy$ = new Subject<void>();

  constructor(private readonly apiClient: ClientApiService) {
    this.initialize();
  }

  private _reloadRooms = new Subject<void>();

  reloadChatRooms() {
    this._reloadRooms.next();
  }

  private _chatRooms!: ReadonlySubject<any[]>;
  private _selectedChatRoom!: ReadonlySubject<any | undefined>;
  private _selectedChatRoomId = new BehaviorSubject<ObjectId | undefined>(undefined);

  initialize() {
    this._chatRooms = new ReadonlySubject<any[]>(
      this._destroy$,
      this._reloadRooms.pipe(
        startWith(undefined),
        switchMap(() => this.apiClient.getChatRooms())
      )
    );

    this._selectedChatRoom = new ReadonlySubject<any | undefined>(
      this._destroy$,
      this._selectedChatRoomId.asObservable().pipe(
        switchMap((id) => {
          if (!id) return of(undefined);
          return this.apiClient.getChatRoomById(id);
        })
      )
    );
  }

  // List all chat rooms
  get chatRooms$() {
    return this._chatRooms.observable$;
  }
  get chatRooms(): any[] {
    return this._chatRooms.value;
  }

  // Selected chat room
  get selectedChatRoom$() {
    return this._selectedChatRoom.observable$;
  }
  get selectedChatRoom(): any | undefined {
    return this._selectedChatRoom.value;
  }
  get selectedChatRoomId(): ObjectId | undefined {
    return this._selectedChatRoomId.value;
  }
  set selectedChatRoomId(id: ObjectId | undefined) {
    this._selectedChatRoomId.next(id);
  }

  // CRUD operations
  createChatRoom(room: any) {
    return this.apiClient.createChatRoom(room).pipe(
      switchMap(result => {
        this.reloadChatRooms();
        return of(result);
      })
    );
  }

  updateChatRoom(update: Partial<any> & { _id: ObjectId; }) {
    return this.apiClient.updateChatRoom(update).pipe(
      switchMap(result => {
        this.reloadChatRooms();
        return of(result);
      })
    );
  }

  deleteChatRoom(id: ObjectId) {
    return this.apiClient.deleteChatRoom(id).pipe(
      switchMap(result => {
        if (this.selectedChatRoomId && this.selectedChatRoomId.toString() === id.toString()) {
          this.selectedChatRoomId = undefined;
        }
        this.reloadChatRooms();
        return of(result);
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
    return this.apiClient.assignAgentToJobInstance(roomId, jobInstanceId, agentInstanceId);
  }
}
