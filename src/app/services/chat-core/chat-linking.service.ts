import { Injectable } from '@angular/core';
import { AgentConfigurationService } from './agent-configuration.service';
import { AgentInstanceService } from './agent-instance.service';
import { ChatJobsService } from './chat-jobs.service';
import { ProjectsService } from './projects.service';
import { AgentInstanceConfiguration } from '../../../model/shared-models/chat-core/agent-instance-configuration.model';
import { ChatAgentIdentityConfiguration } from '../../../model/shared-models/chat-core/agent-configuration.model';
import { ChatJobConfiguration } from '../../../model/shared-models/chat-core/chat-job-data.model';
import { ObjectId } from 'mongodb';
import { ChatJobInstance } from '../../../model/shared-models/chat-core/chat-job-instance.model';
import { ClientApiService } from './api-clients/api-client.service';
import { ChatRoomData } from '../../../model/shared-models/chat-core/chat-room-data.model';
import { ChatRoomsService } from './chat-rooms.service';
import { combineLatestWith, Observable, Subject } from 'rxjs';
import { Project } from '../../../model/shared-models/chat-core/project.model';
import { ChatAgentLink, ChatJobLink } from '../../../model/chat-element-links.models';


/** Provides linking services for chat rooms, jobs, agent instances, and agent configurations. */
@Injectable({
  providedIn: 'root'
})
export class ChatLinkingService {
  constructor(
    readonly agentConfigService: AgentConfigurationService,
    readonly agentInstanceService: AgentInstanceService,
    readonly jobService: ChatJobsService,
    readonly chatRoomService: ChatRoomsService,
    readonly projectService: ProjectsService,
    readonly apiClient: ClientApiService,
  ) {
    this.initialize();
  }

  initialize() {
    this.chatRoomService.chatRooms$.pipe(
      combineLatestWith(
        this.agentInstanceService.agentInstances$,
        this.agentConfigService.agentConfigurations$,
        this.jobService.jobs$,
        this.projectService.currentProject$,
      ),
    ).subscribe(([rooms, agentInstances, agentConfigurations, jobConfigurations, currentProject]) => {
      this.chatRooms = rooms;
      this.agentInstances = agentInstances;
      this.agentConfigurations = agentConfigurations;
      this.jobInstances = rooms.map(r => r.jobs).reduce((p, c) => !!c ? [...p, ...c] : p, []);
      this.jobConfigurations = jobConfigurations;
      this.currentProject = currentProject;

      this.agentLinks = this.agentInstances.map(ai => ({
        instance: ai,
        identity: this.agentConfigurations.find(c => c._id === ai.identity)
      }));

      this.jobLinks = this.jobInstances.map(ji => ({
        jobInstance: ji,
        room: this.chatRooms.find(r => r.jobs.some(j => j.id === ji.id)),
        agent: this.agentLinks.find(l => l.instance._id === ji.agentId),
        jobConfiguration: this.jobConfigurations.find(c => c._id === ji.configurationId)
      }));

      this._jobLinks$.next(this.jobLinks);
    });

    this.apiClient.getJobsForProject;
  }

  currentProject: Project | undefined = undefined;
  agentInstances: AgentInstanceConfiguration[] = [];
  agentConfigurations: ChatAgentIdentityConfiguration[] = [];
  jobInstances: ChatJobInstance[] = [];
  jobConfigurations: ChatJobConfiguration[] = [];
  chatRooms: ChatRoomData[] = [];

  agentLinks: ChatAgentLink[] = [];
  jobLinks: ChatJobLink[] = [];

  private _jobLinks$ = new Subject<ChatJobLink[]>();
  readonly jobLinks$ = this._jobLinks$.asObservable();

  getJobForId(jobId: ObjectId): ChatJobInstance | undefined {
    return this.jobInstances.find(j => j.id === jobId);
  }

  /** Returns the agent configuration for a specified chat job. */
  getAgentConfigsForJob(jobId: ObjectId): ChatAgentIdentityConfiguration | undefined {
    // Get the agent.
    const agent = this.getAgentInstanceForJob(jobId);

    // Validate.
    if (!agent) {
      return undefined;
    }

    // Find and return the configuration.
    return this.agentConfigurations.find(c => c._id === agent.identity);
  }

  /** Returns the agent instace for a specified job instance, specified by its id. */
  getAgentInstanceForJob(jobId: ObjectId): AgentInstanceConfiguration | undefined {
    // Get the job.
    const job = this.getJobForId(jobId);

    if (!job) {
      throw new Error(`Could not find job.`);
    }

    // Find and return the isntance.
    const instance = this.agentInstances.find(a => a._id === job.agentId);
    return instance;
  }
}
