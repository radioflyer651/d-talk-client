// ...existing code...
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectId } from 'mongodb';
import { tap, Observable, EMPTY, map } from 'rxjs';
import { ChatAgentIdentityConfiguration } from '../../../../model/shared-models/chat-core/agent-configuration.model';
import { AgentInstanceConfiguration } from '../../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ChatJobConfiguration } from '../../../../model/shared-models/chat-core/chat-job-data.model';
import { ChatRoomData } from '../../../../model/shared-models/chat-core/chat-room-data.model';
import { ProjectListing } from '../../../../model/shared-models/chat-core/project-listing.model';
import { Project } from '../../../../model/shared-models/chat-core/project.model';
import { NewDbItem } from '../../../../model/shared-models/db-operation-types.model';
import { LoginRequest } from '../../../../model/shared-models/login-request.model';
import { UserRegistration } from '../../../../model/shared-models/user-registration.model';
import { TokenService } from '../../token.service';
import { ClientApiServiceBase } from './api-client-base.service';
import { IChatDocumentCreationParams, IChatDocumentData } from '../../../../model/shared-models/chat-core/documents/chat-document.model';
import { OllamaModelConfiguration } from '../../../../model/shared-models/chat-core/chat-model-params/ollama.model-params';
import { ReturnVoice } from 'hume/api/resources/tts';
/**
 * Type for Hume voice type options.
 */
export type HumeVoiceType = 'HUME_AI' | 'CUSTOM_VOICE';

@Injectable({
  providedIn: 'root',
})
export class ClientApiService extends ClientApiServiceBase {
  constructor(
    http: HttpClient,
    tokenService: TokenService,
  ) {
    super(http, tokenService);
  }

  /**
   * Gets the list of available voices from the Hume voice chat service.
   * @param voiceType The type of voice to fetch ('HUME_AI' or 'CUSTOM_VOICE')
   * @returns Observable<{ voices: ReturnVoice[] }>
   */
  getHumeVoices(voiceType: HumeVoiceType) {
    return this.http.get<ReturnVoice[]>(
      this.constructUrl(`hume/voices?voiceType=${voiceType}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Requests a voice message URL for a given message in a chat room.
   * @param chatRoomId The chat room ID
   * @param messageId The message ID
   * @returns Observable<{ url: string }>
   */
  requestVoiceMessage(chatRoomId: string, messageId: string) {
    return this.http.post<{ url: string; }>(
      this.constructUrl('message-voice'),
      { chatRoomId, messageId },
      this.optionsBuilder.withAuthorization()
    );
  }

  /** Makes a call to attempt to login the user with their credentials. */
  login(loginInfo: LoginRequest) {
    return this.http.post<{ token: string; }>(this.constructUrl('login'), loginInfo)
      .pipe(
        tap(response => {
          this.tokenService.token = response.token;
        })
      );
  }

  /**
   * Registers a new user and sets the token on success.
   */
  registerNewUser(registration: UserRegistration) {
    return this.http.post<{ token: string; }>(this.constructUrl('register'), registration)
      .pipe(
        tap(response => {
          this.tokenService.token = response.token;
        })
      );
  }

  logout(): Observable<void> {
    this.tokenService.token = undefined;
    return EMPTY;
  }

  /**
   * Gets the list of project listings for the current user.
   */
  getProjectListings() {
    return this.http.get<ProjectListing[]>(this.constructUrl('project-listings'), this.optionsBuilder.withAuthorization());
  }

  /**
   * Creates a new project for the current user.
   */
  createProject(name: string) {
    return this.http.post<Project>(this.constructUrl('project'), { name }, this.optionsBuilder.withAuthorization());
  }

  /**
   * Updates the name of a project by its ID (must belong to the authenticated user).
   */
  updateProject(id: ObjectId, project: Project) {
    return this.http.put<{ success: boolean; }>(this.constructUrl(`project/${id}`), project, this.optionsBuilder.withAuthorization());
  }

  /**
   * Deletes a project by its ID (must belong to the authenticated user).
   */
  deleteProject(id: ObjectId) {
    return this.http.delete<{ success: boolean; }>(this.constructUrl(`project/${id}`), this.optionsBuilder.withAuthorization());
  }

  /**
   * Gets a project by its ID (must belong to the authenticated user).
   */
  getProjectById(id: ObjectId) {
    return this.http.get<Project>(this.constructUrl(`project/${id}`), this.optionsBuilder.withAuthorization());
  }

  /**
   * Gets all agent configurations for a project.
   */
  getAgentConfigurations(projectId: ObjectId) {
    return this.http.get<ChatAgentIdentityConfiguration[]>(
      this.constructUrl(`agent-configurations/${projectId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets a single agent configuration by its ID.
   */
  getAgentConfigurationById(agentConfigId: ObjectId) {
    return this.http.get<ChatAgentIdentityConfiguration>(
      this.constructUrl(`agent-configuration/${agentConfigId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new agent configuration for a project.
   */
  createAgentConfiguration(projectId: ObjectId, config: NewDbItem<ChatAgentIdentityConfiguration>) {
    return this.http.post<ChatAgentIdentityConfiguration>(
      this.constructUrl(`agent-configuration`),
      config,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates an existing agent configuration.
   */
  updateAgentConfiguration(config: ChatAgentIdentityConfiguration) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`agent-configuration`),
      config,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes an agent configuration by its ID.
   */
  deleteAgentConfiguration(agentConfigId: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`agent-configuration/${agentConfigId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets all jobs for a project.
   */
  getJobsForProject(projectId: ObjectId) {
    return this.http.get<ChatJobConfiguration[]>(
      this.constructUrl(`jobs/${projectId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets a single job by its ID.
   */
  getJobById(jobId: ObjectId) {
    return this.http.get<ChatJobConfiguration>(
      this.constructUrl(`job/${jobId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new job.
   * The backend expects the full ChatJobConfiguration object, including projectId, but _id should be omitted for creation.
   */
  createJob(job: Omit<ChatJobConfiguration, '_id'>) {
    return this.http.post<ChatJobConfiguration>(
      this.constructUrl('job'),
      job,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates a job by its ID (ID in body).
   * The backend expects _id and projectId in the body.
   */
  updateJob(update: Partial<ChatJobConfiguration> & { _id: ObjectId; }) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl('job'),
      update,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes a job by its ID.
   */
  deleteJob(jobId: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`job/${jobId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets all chat rooms for the current user.
   */
  getChatRoomsForProject(projectId: ObjectId) {
    return this.http.get<ChatRoomData[]>(
      this.constructUrl(`project/${projectId}/chat-rooms`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets a single chat room by its ID.
   */
  getChatRoomById(roomId: ObjectId) {
    return this.http.get<ChatRoomData>(
      this.constructUrl(`chat-room/${roomId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new chat room. Only name and projectId are required; other fields are set server-side.
   */
  createChatRoom(room: { name: string; projectId: ObjectId; }) {
    return this.http.post<ChatRoomData>(
      this.constructUrl('chat-room'),
      room,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates a chat room by its ID (ID in body).
   */
  updateChatRoom(update: Partial<ChatRoomData> & { _id: ObjectId; }) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl('chat-room'),
      update,
      this.optionsBuilder.withAuthorization()
    );
  }

  /** Updates the name of a specified chat room. */
  updateChatRoomName(roomId: ObjectId, roomName: string) {
    return this.http.post<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/name`),
      { roomName: roomName },
      this.optionsBuilder.withAuthorization()
    ).pipe(map(() => {
      return undefined;
    }));
  }

  /**
   * Deletes a chat room by its ID.
   */
  deleteChatRoom(roomId: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new agent instance for a chat room.
   */
  createAgentInstanceForChatRoom(roomId: ObjectId, identityId: ObjectId, agentName: string) {
    return this.http.post<AgentInstanceConfiguration>(
      this.constructUrl(`chat-room/${roomId}/agent-instance`),
      { identityId, agentName },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes an agent instance from a chat room.
   */
  deleteAgentInstanceFromChatRoom(roomId: ObjectId, agentInstanceId: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/agent-instance/${agentInstanceId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Assigns an agent instance to a job instance in a chat room.
   */
  assignAgentToJobInstance(roomId: ObjectId, jobInstanceId: ObjectId, agentInstanceId: ObjectId) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/job-instance/${jobInstanceId}/assign-agent`),
      { agentInstanceId },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Removes an agent from a job instance in a chat room.
   */
  removeAgentFromJobInstance(roomId: ObjectId, jobInstanceId: ObjectId) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/job-instance/${jobInstanceId}/remove-agent`),
      {},
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets all agent instances for a given agent identity (configuration).
   */
  getAgentInstancesForIdentity(identityId: ObjectId) {
    return this.http.get<AgentInstanceConfiguration[]>(
      this.constructUrl(`agent-instances/${identityId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets a single agent instance by its ID.
   */
  getAgentInstanceById(instanceId: ObjectId) {
    return this.http.get<AgentInstanceConfiguration>(
      this.constructUrl(`agent-instance/${instanceId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new agent instance.
   */
  createAgentInstance(instance: AgentInstanceConfiguration) {
    return this.http.post<AgentInstanceConfiguration>(
      this.constructUrl('agent-instance'),
      instance,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates an agent instance by its ID (ID in body).
   */
  updateAgentInstance(instance: Partial<AgentInstanceConfiguration> & { _id: ObjectId; }) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl('agent-instance'),
      instance,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes an agent instance by its ID.
   */
  deleteAgentInstance(instanceId: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`agent-instance/${instanceId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets multiple agent instances by an array of IDs.
   */
  getAgentInstancesByIds(ids: ObjectId[]) {
    return this.http.post<AgentInstanceConfiguration[]>(
      this.constructUrl('agent-instances/by-ids'),
      ids,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets all agent instances for a given chat room.
   */
  getAgentInstancesForChatRoom(chatRoomId: ObjectId) {
    return this.http.get<AgentInstanceConfiguration[]>(
      this.constructUrl(`agent-instances/by-chat-room/${chatRoomId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
 * Updates the roomInstructions property of a chat room.
 * @param roomId The chat room ID
 * @param roomInstructions The new instructions array
 */
  updateChatRoomInstructions(roomId: ObjectId, roomInstructions: any[]) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/instructions`),
      { roomInstructions },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new job instance for a chat room.
   * @param roomId The chat room ID
   * @param jobConfigurationId The job configuration ID to instantiate
   */
  createJobInstanceForChatRoom(roomId: ObjectId, jobConfigurationId: ObjectId) {
    return this.http.post<any>(
      this.constructUrl(`chat-room/${roomId}/job-instance`),
      { jobConfigurationId },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes a job instance from a chat room.
   * @param roomId The chat room ID
   * @param jobInstanceId The job instance ID to delete
   */
  deleteJobInstanceFromChatRoom(roomId: ObjectId, jobInstanceId: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/job-instance/${jobInstanceId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Sets the 'disabled' property of a job instance in a chat room.
   */
  setJobInstanceDisabled(roomId: ObjectId, jobId: ObjectId | string, disabled: boolean) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/job-instance/${jobId}/disabled`),
      { disabled },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Sets the order of a job instance in a chat room.
   */
  setJobInstanceOrder(roomId: ObjectId, jobId: ObjectId | string, newPosition: number) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/job-instance/${jobId}/order`),
      { newPosition },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates the projectKnowledge property of a project.
   * @param projectId The project ID
   * @param projectKnowledge The new knowledge array
   */
  updateProjectKnowledge(projectId: ObjectId, projectKnowledge: any[]) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`project/${projectId}/project-knowledge`),
      { projectKnowledge },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets all chat documents for a project.
   */
  getChatDocumentsForProject(projectId: ObjectId) {
    return this.http.get<IChatDocumentData[]>(
      this.constructUrl(`documents/${projectId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets a single chat document by its ID.
   */
  getChatDocumentById(documentId: ObjectId) {
    return this.http.get<IChatDocumentData>(
      this.constructUrl(`document/${documentId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new chat document.
   */
  createChatDocument(document: IChatDocumentCreationParams) {
    return this.http.post<IChatDocumentData>(
      this.constructUrl('document'),
      document,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates a chat document by its ID (ID in body).
   */
  updateChatDocument(update: Partial<IChatDocumentData> & { _id: ObjectId; }) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl('document'),
      update,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes a chat document by its ID.
   */
  deleteChatDocument(documentId: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`document/${documentId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets lightweight chat document list items for a project.
   */
  getChatDocumentListItemsForProject(projectId: ObjectId) {
    return this.http.get<IChatDocumentData[]>(
      this.constructUrl(`document-list/${projectId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates the chatDocumentReferences property of a chat room.
   * @param roomId The chat room ID
   * @param chatDocumentReferences The new document permissions array/object
   */
  updateChatRoomDocumentPermissions(roomId: ObjectId, chatDocumentReferences: any) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl(`chat-room/${roomId}/document-permissions`),
      { chatDocumentReferences },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets all Ollama model configurations.
   */
  getOllamaModelConfigurations() {
    return this.http.get<OllamaModelConfiguration[]>(
      this.constructUrl('ollama-model-configs'),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Gets a single Ollama model configuration by its ID.
   */
  getOllamaModelConfigurationById(id: ObjectId) {
    return this.http.get<OllamaModelConfiguration>(
      this.constructUrl(`ollama-model-config/${id}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Creates a new Ollama model configuration.
   */
  createOllamaModelConfiguration(config: NewDbItem<OllamaModelConfiguration>) {
    return this.http.post<OllamaModelConfiguration>(
      this.constructUrl('ollama-model-config'),
      config,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Updates an Ollama model configuration by its ID.
   */
  updateOllamaModelConfiguration(update: Partial<OllamaModelConfiguration> & { _id: ObjectId; }) {
    return this.http.put<{ success: boolean; }>(
      this.constructUrl('ollama-model-config'),
      update,
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Deletes an Ollama model configuration by its ID.
   */
  deleteOllamaModelConfiguration(id: ObjectId) {
    return this.http.delete<{ success: boolean; }>(
      this.constructUrl(`ollama-model-config/${id}`),
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Sets the disabled state of an instruction or identity message on an agent configuration.
   */
  setAgentConfigurationMessageDisabled(agentId: ObjectId, messageType: 'instruction' | 'identity', messageIndex: number, newDisabledValue: boolean,) {
    return this.http.patch(
      this.constructUrl(`agent-configuration/${agentId}/message-disabled`), { messageType, messageIndex, newDisabledValue },
      this.optionsBuilder.withAuthorization()
    );
  }

  /**
   * Sets the disabled state of an instruction or identity message on a job configuration.
   */
  setJobInstructionDisabled(
    jobId: ObjectId,
    messageIndex: number,
    newDisabledValue: boolean,
  ) {
    return this.http.patch<{ success: boolean; }>(this.constructUrl(`job/${jobId}/message-disabled`),
      { messageIndex, newDisabledValue }, this.optionsBuilder.withAuthorization()
    );
  }

}
