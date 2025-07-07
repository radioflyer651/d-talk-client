import { AgentInstanceConfiguration } from "./shared-models/chat-core/agent-instance-configuration.model";
import { ChatJobConfiguration } from "./shared-models/chat-core/chat-job-data.model";
import { ChatJobInstance } from "./shared-models/chat-core/chat-job-instance.model";


/** Represents a job instance that's linked to its configuration. */
export interface LinkedJobInstance extends ChatJobInstance {

    /** The job configuration that the job was linked to. */
    configuration: ChatJobConfiguration;

    /** The agent assigned to this job instance. */
    agent: AgentInstanceConfiguration | undefined;
}