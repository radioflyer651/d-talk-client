import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, combineLatestWith, lastValueFrom, map, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { ClientApiService } from './api-clients/api-client.service';
import { ObjectId } from 'mongodb';
import { ChatRoomData } from '../../../model/shared-models/chat-core/chat-room-data.model';
import { ProjectsService } from './projects.service';
import { LinkedJobInstance } from '../../../model/linked-job-instance.model';
import { ChatJobsService } from './chat-jobs.service';
import { AgentInstanceService } from './agent-instance.service';
import { ChatJobInstance } from '../../../model/shared-models/chat-core/chat-job-instance.model';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomsService {
  constructor(
    private readonly apiClient: ClientApiService,
    private readonly projectService: ProjectsService,
    private readonly jobService: ChatJobsService,
    private readonly agentService: AgentInstanceService,
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
          }),
        );
      }),
      shareReplay(),
    );

    this.selectedChatRoomJobInstances$ = this.selectedChatRoom$.pipe(
      combineLatestWith(this.jobService.jobs$, this.agentService.agentInstances$),
      map(([chatRoom, jobList, agentList]) => {
        if (!chatRoom || !chatRoom.jobs) {
          return [];
        }

        const result = chatRoom.jobs.map(j => {
          // Get the configuration for this.
          const config = jobList.find(d => d._id === j.configurationId);

          // Get the agent for this.
          const agent = agentList.find(a => a._id === j.agentId);

          return { ...j, configuration: config, agent: agent } as LinkedJobInstance;
        });

        return result;
      })
    );

    this.selectedChatRoomJobInstances$.subscribe(jobs => {
      this.chatRoomJobInstances = jobs;
    });

    this.selectedChatRoom$.subscribe(room => {
      this._selectedChatRoom = room;
    });
  }

  /** Contains the job instances for the current chat room. */
  chatRoomJobInstances: LinkedJobInstance[] = [];

  /** Returns a list of LinkedJobInstance objects for all jobs linked to a specified chat room. */
  selectedChatRoomJobInstances$!: Observable<LinkedJobInstance[]>;

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

  /** Sets the disabled status on a specified job instance, and updates the value on the server. */
  async setDisabledChatRoomJob(jobId: ObjectId, newValue: boolean): Promise<void> {
    // Validate.
    if (!this.selectedChatRoomId) {
      throw new Error(`No selected chat room ID available.`);
    }

    const job = this.chatRoomJobInstances.find(j => j.id === jobId);
    if (!job) {
      throw new Error(`Job not found with ID: ${jobId}`);
    }

    // Set the local value.
    job.disabled = newValue;

    // Update the server.
    await lastValueFrom(this.apiClient.setJobInstanceDisabled(this.selectedChatRoomId, jobId, newValue));
  }

  async setChatJobOrder(jobId: ObjectId, newPosition: number): Promise<void> {
    // Get the chat room and validate it.
    const room = this.selectedChatRoom;
    if (!room) {
      throw new Error(`No chat room is currently selected.`);
    }

    // Get the job, and remove it from the room.
    const jobIndex = room.jobs.findIndex(j => j.id === jobId);
    const job = room.jobs.splice(jobIndex, 1)[0];

    // Place the job in the proper location.
    if (newPosition > room.jobs.length - 1) {
      room.jobs.push(job);
    } else {
      room.jobs.splice(newPosition, 0, job);
    }

    // Update the position on the server.
    await lastValueFrom(this.apiClient.setJobInstanceOrder(room._id, jobId, newPosition));
  }

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
    this._reloadSelectedChatRoom.next();
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

  createJobInstanceForChatRoom(roomId: ObjectId, jobConfigurationId: ObjectId) {
    return this.apiClient.createJobInstanceForChatRoom(roomId, jobConfigurationId).pipe(
      switchMap(result => {
        this.reloadSelectedChatRoom();
        return of(result);
      })
    );
  }

  deleteJobInstanceFromChatRoom(roomId: ObjectId, jobInstanceId: ObjectId) {
    return this.apiClient.deleteJobInstanceFromChatRoom(roomId, jobInstanceId).pipe(
      switchMap(result => {
        this.reloadSelectedChatRoom();
        return of(result);
      })
    );
  }
}
