import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EMPTY, Observable, tap } from 'rxjs';
import { TokenService } from '../token.service';
import { LoginRequest } from '../../../model/shared-models/login-request.model';
import { TokenPayload } from '../../../model/shared-models/token-payload.model';
import { ProjectListing } from '../../../model/shared-models/chat-core/project-listing.model';
import { Project } from '../../../model/shared-models/chat-core/project.model';
import { ObjectId } from 'mongodb';
import { UserRegistration } from '../../../model/shared-models/user-registration.model';
import { ChatAgentIdentityConfiguration } from '../../../model/shared-models/chat-core/agent-configuration.model';
import { NewDbItem } from '../../../model/shared-models/db-operation-types.model';
import { ChatJobConfiguration } from '../../../model/shared-models/chat-core/chat-job-data.model';
import { ChatRoomData } from '../../../model/shared-models/chat-core/chat-room-data.model';
import { AgentInstanceConfiguration } from '../../../model/shared-models/chat-core/agent-instance-configuration.model';

// Extract the type of the `post` method from `HttpClient`
type HttpClientPostMethod = HttpClient['post'];

// Extract the type of the `options` parameter from the `post` method
type HttpClientPostOptions = Parameters<HttpClientPostMethod>[2];

// Extract the type of the `post` method from `HttpClient`
type HttpClientGetMethod = HttpClient['get'];

// Extract the type of the `options` parameter from the `post` method
type HttpClientGetOptions = Parameters<HttpClientGetMethod>[1];

type HttpCallOptions = HttpClientGetOptions | HttpClientPostOptions;

class HttpOptionsBuilder {
  constructor(
    readonly parent: ClientApiService,
    readonly tokenService: TokenService,
  ) {
  }

  /** Shortcut to just return options with the authorization header. */
  withAuthorization(): HttpCallOptions {
    return this.buildOptions().addAuthToken().build();
  }

  buildOptions(): OptionsBuilderInternal {
    return new OptionsBuilderInternal(this);
  }
}

class OptionsBuilderInternal {
  constructor(
    readonly parent: HttpOptionsBuilder
  ) { }

  protected _optionsBuilder: Exclude<HttpCallOptions, undefined | null> = {};

  /** Returns the TokenService from the parent. */
  get tokenService() {
    return this.parent.tokenService;
  }

  /** Returns the API service from the parent. */
  get parentApiService() {
    return this.parent.parent;
  }

  /** Returns the headers property from the options. */
  private getHeaders(): { [key: string]: string; } {
    if (!this._optionsBuilder.headers) {
      this._optionsBuilder.headers = {} as { [key: string]: string; };
    }

    return this._optionsBuilder.headers as { [key: string]: string; };
  }

  /** Adds a token to the headers. */
  addAuthToken() {
    if (this.tokenService.token) {
      this.getHeaders()['Authorization'] = this.tokenService.token;
    }
    return this;
  }

  build(): HttpCallOptions {
    return this._optionsBuilder;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ClientApiService {
  constructor(
    protected readonly http: HttpClient,
    protected readonly tokenService: TokenService,
  ) {
    this.optionsBuilder = new HttpOptionsBuilder(this, this.tokenService);
  }

  protected readonly optionsBuilder: HttpOptionsBuilder;

  /** The base URL to the API. */
  protected readonly baseUrl = environment.apiBaseUrl;

  /** Combines a specified path with the base URL. */
  private constructUrl(path: string) {
    return this.baseUrl + path;
  }

  /** Attempts to parse a token, and return the TokenPayload. */
  parseToken(token: string): TokenPayload {
    if (!token) {
      throw new Error(`token was empty.`);
    }

    // Decode the Base64 token.
    return JSON.parse(atob(token.split('.')[1])) as TokenPayload;
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
    return this.http.delete<{ success: boolean }>(
      this.constructUrl(`chat-room/${roomId}/job-instance/${jobInstanceId}`),
      this.optionsBuilder.withAuthorization()
    );
  }

}
