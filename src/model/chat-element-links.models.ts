import { ChatAgentIdentityConfiguration } from "./shared-models/chat-core/agent-configuration.model";
import { AgentInstanceConfiguration } from "./shared-models/chat-core/agent-instance-configuration.model";
import { ChatJobConfiguration } from "./shared-models/chat-core/chat-job-data.model";
import { ChatJobInstance } from "./shared-models/chat-core/chat-job-instance.model";
import { ChatRoomData } from "./shared-models/chat-core/chat-room-data.model";

/** Linkage between a specific Agent Instance and it's configuration. */
export interface ChatAgentLink {
    instance: AgentInstanceConfiguration;
    identity?: ChatAgentIdentityConfiguration;
}

/** Linkages based on a specific ChatJobInstance. */
export interface ChatJobLink {
    jobInstance: ChatJobInstance;
    room?: ChatRoomData;
    jobConfiguration?: ChatJobConfiguration;
    agent?: ChatAgentLink;
}
