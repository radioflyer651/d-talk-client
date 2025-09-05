# Copilot Instructions for d-talk-client

This project is an Angular 19 front-end for DTalk2, a multi-agent chat application. It is structured for modularity, maintainability, and real-time chat, with agent orchestration and project-based workflows.

## Architecture Overview
- **Major Components:**
  - `src/app/components/`: UI components by feature (chat, login, registration, project management).
  - `src/app/services/`: Core business logic and state (user, chat, socket, etc).
  - `src/app/chat-core-services/model-services/`: LLM/model integrations (Ollama, OpenAI, etc).
  - `src/app/model/`: Shared data models for API and UI.
- **Data Flow:**
  - RxJS observables for state/event propagation (user state, chat history, page size, etc).
  - Real-time chat/room updates via `ChatSocketService` and `SocketService`.
  - Project, agent, and chat room data loaded reactively via services.
- **Why:**
  - Extensible for new agent types, chat features, or integrations.
  - Clear separation of UI, state, and API logic.

## Project-Specific Conventions
- **Component Base Class:**
  - All major components extend `ComponentBase` for consistent lifecycle/teardown (`component-base.component.ts`).
- **Reactive State:**
  - Use RxJS for all shared state (user, page size, chat history, etc).
  - `ReadonlySubject` has been used in the past, and is a pattern we wish to remove over time, and avoid.
    - Standard RXJS patterns will replace this.
- **Service Injection:**
  - Services are provided in root and injected via constructors for testability/singleton behavior.
- **SCSS Styles:**
  - All components use SCSS. Global styles in `src/styles.scss` and variables/mixins in root SCSS files.
- **Routing:**
  - Deeply nested routes for project/agent/chat navigation (`app.routes.ts`).
- **Socket Communication:**
  - Real-time features use `ChatSocketService` and `SocketService` for room join/leave and message streaming.

## Common Services
Use these services to find/store application data:
- `src/app/services/chat-core/api-client.service.ts`: All API calls to the server.
- `src/app/services/chat-core/projects.service.ts`: Current project and user project list.
- `src/app/services/chat-core/chat-rooms.service.ts`: Selected chat room and chat rooms for current project.
- `src/app/services/chat-core/agent-configuration.service.ts`: Current agent config and list for current project.
- `src/app/services/chat-core/chat-jobs.service.ts`: Selected chat job/configs and list for current project.
- `src/app/services/chat-core/chat-model-config.service.ts`: Methods for chat model configurations (action-oriented).
- `src/app/services/chat-core/agent-instance.service.ts`: Methods for chat agent instances.

## Important Models
Core model files for major application data:
- `src/model/shared-models/chat-core/agent-configuration.model.ts`
- `src/model/shared-models/chat-core/agent-instance-configuration.model.ts`
- `src/model/shared-models/chat-core/agent-reference.model.ts`
- `src/model/shared-models/chat-core/chat-job-data.model.ts`
- `src/model/shared-models/chat-core/chat-job-instance.model.ts`
- `src/model/shared-models/chat-core/chat-room-busy-state.model.ts`
- `src/model/shared-models/chat-core/chat-room-data.model.ts`
- `src/model/shared-models/chat-core/chat-room-event.model.ts`
- `src/model/shared-models/chat-core/chat-room-events.model.ts`
- `src/model/shared-models/chat-core/message-speaker.model.ts`
- `src/model/shared-models/chat-core/model-service-params.model.ts`
- `src/model/shared-models/chat-core/plugin-instance-reference.model.ts`
- `src/model/shared-models/chat-core/plugin-specification.model.ts`
- `src/model/shared-models/chat-core/positionable-message.model.ts`
- `src/model/shared-models/chat-core/project-listing.model.ts`
- `src/model/shared-models/chat-core/project.model.ts`

### Model/Service Parity with Server
Models in `src/model/shared-models/` are shared with the server project. These must remain browser-compatible and are the primary interface for all chat, agent, job, and project data. Some types (e.g., `ObjectId`) are aliased for browser use.

Folders named `chat-core` hold source files specific to chat and LLM functionality, and are unique to the application's core logic.

### Chat Lifecycle (Client Perspective)
When a user sends a chat message:
- The client hydrates the ChatRoom, including agents, jobs, and related data, using the services above.
- Each chat job is run in sequence, with the associated agent responding to the message. The client coordinates this via RxJS streams and service calls.
- Only the final LLM responses and tool calls are persisted in the chat history; temporary context is managed in-memory per interaction.

The client mirrors the server's use of the `IChatLifetimeContributor` pipeline for assembling chat context, though actual LLM calls and plugin execution occur server-side.

### Projects and Data Isolation
All data (agents, jobs, rooms, documents) is scoped to a project. The client must always operate within the current project context, as enforced by the services and route structure.

### Project, Room, Agent, and Job Separation
- **Projects** are containers for all data (agents, jobs, rooms, documents, knowledge stores, etc). Data is not shared between projects.
- **Chat Rooms** are environments for users and/or chat agents, supporting collaborative features (e.g., documents, agent communication). The client UI provides panes and controls for these features.
- **Chat Agents** have a configuration (reusable across rooms) and can have multiple instances (one per room). Chat histories are not shared between agent instances, but long-term memory may be.
- **Chat Jobs** are fulfilled by agents. Jobs have configurations (project-level) and instances (room-level). Each job instance must have an agent instance assigned. Jobs provide actionable instructions for the agent to execute on its turn.
- **Plugins** and **tools** are extensibility points for agents and jobs. Plugins may provide tools, instructions, or notifications to agents, and can be used for features like document windows, long-term memory, or knowledge stores. The client may surface plugin/tool configuration and assignment in the UI.

#### Instances vs. Configuration
Both agents and jobs have a configuration (project-level, reusable) and instance (room-level, specific to a chat room). The client should distinguish between these when presenting or editing data.

#### Knowledge Stores and Instruction Sets
Projects may have knowledge stores (name/value pairs) and reusable agent instruction sets. These can be surfaced in the UI for assignment to agents or rooms.

## Example Components
Reference these files when designing new components:

### List Components
- Chat Job List:
  - `src/app/components/chat-core/chat-jobs/chat-job-list/chat-job-list.component.{ts,scss,html}`
- Agent Configurations:
  - `src/app/components/chat-core/agent-configurations/agent-config-list/agent-config-list.component.{ts,scss,html}`
- Projects List:
  - `src/app/components/chat-core/projects/project-list/project-list.component.{ts,scss,html}`

### Detail Components
- Chat Job Detail:
  - `src/app/components/chat-core/chat-jobs/chat-job-detail/chat-job-detail.component.{ts,scss,html}`
- Agent Config Detail:
  - `src/app/components/chat-core/agent-configurations/agent-config-detail/agent-config-detail.component.{ts,scss,html}`
- Project Detail:
  - `src/app/components/chat-core/projects/project-detail/project-detail.component.{ts,scss,html}`

## Chat Room Details Component
When building or updating chat room details, ensure the user can:
- View list of chat jobs and chat agents defined in the owning project.
- Instantiate chat agents and jobs from those project definitions.
- Assign instantiated agents to instantiated jobs.

## Integration Points
- **Back-End:**
  - Communicates with DTalk2 server ([server repo](https://github.com/radioflyer651/d-talk-server)).
  - CORS and port alignment are critical for local development.
- **LLM/Model Services:**
  - Extend `ILlmModelServiceBase` for new model integrations.
- **External Libraries:**
  - Uses PrimeNG for UI, Monaco Editor for code, and RxJS for state.

## Examples
- **Adding a New Chat Feature:**
  - Create a service in `services/chat-core/`, a component in `components/chat-core/`, and update routes as needed.
- **Extending Models:**
  - Add new model files to `model/` and update service logic to consume them.

## Key Files
- `src/app/app.routes.ts`: Route structure and navigation.
- `src/app/services/`: Core business logic and state.
- `src/app/components/`: UI and feature modules.
- `src/environments/`: Environment-specific config.
- `angular.json`: Build and port config.

---

If you are unsure about a workflow or pattern, check the referenced files or ask for clarification. Keep changes modular and follow the observable/reactive patterns throughout the codebase.
