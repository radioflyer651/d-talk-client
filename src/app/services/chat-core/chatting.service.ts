import { Injectable } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ChatRoomsService } from './chat-rooms.service';
import { lastValueFrom, map, Observable, share, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { StoredMessage } from '@langchain/core/messages';
import { ChatRoomData } from '../../../model/shared-models/chat-core/chat-room-data.model';
import { ChattingApiClientService } from './api-clients/chatting-api-client.service';
import { AgentInstanceService } from './agent-instance.service';
import { ObjectId } from 'mongodb';
import { AgentInstanceConfiguration } from '../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ChatJobsService } from './chat-jobs.service';
import { ChatJobConfiguration } from '../../../model/shared-models/chat-core/chat-job-data.model';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  constructor(
    readonly projectService: ProjectsService,
    readonly chatRoomService: ChatRoomsService,
    readonly chattingApiClient: ChattingApiClientService,
    readonly agentInstanceService: AgentInstanceService,
    readonly chatJobsService: ChatJobsService,
  ) {
    this.initialize();
  }

  private _refreshChatHistory$ = new Subject<void>();
  private _reloadChatHistory$ = new Subject<void>();
  private _agents: AgentInstanceConfiguration[] = [];
  private _jobs: ChatJobConfiguration[] = [];

  initialize() {
    this._reloadChatHistory$.subscribe(() => {
      this.chatRoomService.reloadSelectedChatRoom();
    });

    this.chatHistory$ = this.chatRoomService.selectedChatRoom$.pipe(
      tap(room => {
        this.chatRoom = room;
      }),
      switchMap(room => {
        return this._refreshChatHistory$.pipe(
          startWith(undefined),
          map(() => {
            return room?.conversation ?? [];
          })
        );
      }),
    );

    this.agentInstanceService.agentInstances$.subscribe(instances => {
      this._agents = instances;
    });

    this.chatJobsService.jobs$.subscribe(jobs => {
      this._jobs = jobs;
    });
  }

  chatRoom: ChatRoomData | undefined;

  chatHistory$!: Observable<StoredMessage[]>;

  /** Whether a chat request is currently in flight. */
  isLoading = false;

  /** Cancels the in-flight chat request, if any. Replaced each time a request starts. */
  cancelMessage: () => void = () => undefined;

  sendChatMessage(message: string) {
    if (!this.chatRoom) {
      throw new Error(`No chat room is selected.`);
    }

    // Make the API call. share() ensures a single HTTP request even when multiple
    // subscribers exist (the service's internal subscription + the caller's subscription).
    const response$ = this.chattingApiClient.sendChatMessage(this.chatRoom._id, message).pipe(share());

    let completed = false;

    const onSuccess = (response: StoredMessage[]) => {
      completed = true;
      if (!this.chatRoom) {
        return;
      }

      // Add the response to the chat history.
      if (!this.chatRoom!.conversation) {
        this.chatRoom.conversation = [];
      }

      // If there are any messages in the list with the same IDs, we need to remove them.
      this.chatRoom.conversation = this.chatRoom.conversation.filter(t => !t.data.id || !response.some(r => r.data.id === t.data.id));
      this.chatRoom.conversation.push(...response);
      this._refreshChatHistory$.next();
    };

    const reloadHistory = () => {
      if (!completed) {
        completed = true;
        this.reloadChatHistory();
      }
    };

    // Mark the service as busy and wire up cancellation before returning.
    this.isLoading = true;
    const subscription = response$.pipe(
      tap({
        next: (response) => onSuccess(response),
        error: () => reloadHistory(),
        complete: () => reloadHistory(),
      }),
    ).subscribe({
      next: () => this._finishLoading(),
      error: () => this._finishLoading(),
      complete: () => this._finishLoading(),
    });

    this.cancelMessage = () => {
      subscription.unsubscribe();
      setTimeout(() => {
        this.reloadChatHistory();
        this._finishLoading();
      }, 1000);
    };

    // Return the underlying observable so callers can still react to completion.
    return response$;
  }

  /**
   * Triggers a single prompt-less LLM turn for the specified job instance.
   * No user message is added to the conversation. The job executes even if
   * it is currently disabled; all other jobs are skipped.
   * Sets isLoading and wires cancelMessage identically to sendChatMessage.
   * @param jobInstanceId The ID of the ChatJobInstance that should take a turn.
   * @returns An Observable that emits the resulting stored messages on completion.
   */
  takeTurnForJob(jobInstanceId: ObjectId): Observable<StoredMessage[]> {
    if (!this.chatRoom) {
      throw new Error('No chat room is selected.');
    }

    // Send an empty message with the target job ID — no HumanMessage will be added.
    const response$ = this.chattingApiClient.sendChatMessage(this.chatRoom._id, '', jobInstanceId);

    let completed = false;

    const onSuccess = (response: StoredMessage[]) => {
      completed = true;
      if (!this.chatRoom) {
        return;
      }

      // Add the response to the chat history.
      if (!this.chatRoom.conversation) {
        this.chatRoom.conversation = [];
      }

      // Remove any duplicate messages by ID before appending the new ones.
      this.chatRoom.conversation = this.chatRoom.conversation.filter(t => !t.data.id || !response.some(r => r.data.id === t.data.id));
      this.chatRoom.conversation.push(...response);
      this._refreshChatHistory$.next();
    };

    const reloadHistory = () => {
      if (!completed) {
        completed = true;
        this.reloadChatHistory();
      }
    };

    // Mark the service as busy and wire up cancellation before returning.
    this.isLoading = true;
    const subscription = response$.pipe(
      tap({
        next: (response) => onSuccess(response),
        error: () => reloadHistory(),
        complete: () => reloadHistory(),
      }),
    ).subscribe({
      next: () => this._finishLoading(),
      error: () => this._finishLoading(),
      complete: () => this._finishLoading(),
    });

    this.cancelMessage = () => {
      subscription.unsubscribe();
      setTimeout(() => {
        this.reloadChatHistory();
        this._finishLoading();
      }, 1000);
    };

    return response$;
  }

  /** Clears the loading state and resets the cancel function. */
  private _finishLoading(): void {
    this.isLoading = false;
    this.cancelMessage = () => undefined;
  }

  async clearMessages() {
    if (!this.chatRoom) {
      throw new Error(`There is no current chat room.`);
    }

    await lastValueFrom(this.chattingApiClient.clearChatRoomConversation(this.chatRoom._id));
    this.chatRoomService.reloadSelectedChatRoom();
  }

  refreshChatHistory() {
    this._refreshChatHistory$.next();
  }

  reloadChatHistory() {
    this._reloadChatHistory$.next();
  }

  /**
   * Updates a chat message in the current chat room and refreshes chat history.
   * @param messageId The message ID
   * @param newContent The new content for the message
   */
  async updateChatMessageInChatRoom(messageId: string, newContent: string) {
    if (!this.chatRoom) {
      throw new Error('No chat room is selected.');
    }
    await lastValueFrom(
      this.chattingApiClient.updateChatMessageInChatRoom(this.chatRoom._id, messageId, newContent)
    );
    this.reloadChatHistory();
  }

  /**
   * Deletes a chat message in the current chat room and refreshes chat history.
   * @param messageId The message ID
   */
  async deleteChatMessageInChatRoom(messageId: string) {
    if (!this.chatRoom) {
      throw new Error('No chat room is selected.');
    }

    await lastValueFrom(
      this.chattingApiClient.deleteChatMessageInChatRoom(this.chatRoom._id, messageId)
    );

    this.reloadChatHistory();
  }


  /**
   * Deletes a chat message in the current chat room and refreshes chat history.
   * @param messageId The message ID
   */
  async deleteChatMessageInChatRoomAndAfter(messageId: string) {
    if (!this.chatRoom) {
      throw new Error('No chat room is selected.');
    }

    await lastValueFrom(
      this.chattingApiClient.deleteChatMessageAndAfter(this.chatRoom._id, messageId)
    );

    this.reloadChatHistory();
  }

  /** Returns an agent instance for a specified ID. */
  getAgentInstance(agentId: ObjectId): AgentInstanceConfiguration | undefined {
    return this._agents.find(i => i._id === agentId);
  }

  /** Returns a ChatJob, with a specified ID. */
  getChatJob(jobId: ObjectId | undefined): ChatJobConfiguration | undefined {
    if (!jobId) {
      return undefined;
    }

    return this._jobs.find(j => j._id === jobId);
  }
}
