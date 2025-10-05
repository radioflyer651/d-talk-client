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
- **TypeScript Standards:**
  - Always reference the [TypeScript Standards](./instructions/typescript-standards.instructions.md)
  - Never use single-line `if` statements - always use blocks
  - Avoid `any` type; use interfaces over classes for data models
  - Export items individually, never use default exports
  - Use JSDOC comments for all functions/methods
- **Component Base Class:**
  - All major components extend `ComponentBase` (`src/app/components/component-base/component-base.component.ts`)
  - Provides `ngDestroy$` observable for automatic subscription cleanup with `takeUntil()`
- **Reactive State:**
  - Use standard RxJS patterns (BehaviorSubject, switchMap, etc.)
  - **DEPRECATING:** `ReadonlySubject` pattern - migrate to standard RxJS over time
  - Services emit observables; components subscribe with `takeUntil(this.ngDestroy$)`
- **Service Injection:**
  - Services are provided in root and injected via constructors for testability/singleton behavior.
- **SCSS Styles:**
  - All components use SCSS. Global styles in `src/styles.scss` and variables/mixins in root SCSS files.
- **Routing:**
  - Deeply nested routes for project/agent/chat navigation (`app.routes.ts`).
  - Uses `authenticatedGuard` for protected routes
- **Socket Communication:**
  - Real-time features use `ChatSocketService` and `SocketService` for room join/leave and message streaming.

## Common Services
Use these services to find/store application data:
- `src/app/services/chat-core/api-clients/api-client.service.ts`: All API calls to the server (as `ClientApiService`).
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

## Development Workflows

### Local Development Setup
- **Port Configuration:** Client runs on port `54647` (configured in `angular.json`)
- **Environment Files:** 
  - Development: `src/environments/environment.development.ts` (API at localhost:1062)
  - Production: `src/environments/environment.ts`
- **CORS:** Ensure server allows `http://localhost:54647` for local development
- **Socket.IO:** Uses path `/chat-io/` for real-time communication

### Build & Run Commands
```bash
npm start          # Development server on port 54647
npm run build      # Production build
npm run watch      # Development build with file watching
npm test           # Run unit tests
```

### Component Development Pattern
1. Extend `ComponentBase` for lifecycle management
2. Import required PrimeNG modules in component `imports` array
3. Use `takeUntil(this.ngDestroy$)` for subscription cleanup
4. Follow service injection pattern via constructor
5. Use SCSS for styling with component-specific `.scss` files

## Integration Points
- **Back-End:**
  - Communicates with DTalk2 server ([server repo](https://github.com/radioflyer651/d-talk-server)).
  - CORS and port alignment are critical for local development.
- **LLM/Model Services:**
  - Extend `ILlmModelServiceBase` for new model integrations.
- **External Libraries:**
  - **PrimeNG 19:** Primary UI component library with themes
  - **Monaco Editor:** Code editing capabilities (`@monaco-editor/loader`)
  - **Socket.io-client:** Real-time communication
  - **RxJS:** Reactive programming and state management
  - **MongoDB:** MongoDB is NOT actually imported.  See notes above regarding its use.
- **Angular 19 Features:**
  - Uses standalone components (no NgModules)
  - Component `imports` array for module dependencies
  - Signal-based change detection patterns where applicable

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

## Shared Models/Code
  - Some code and models are shared with the server-side project.
  - Shared code is strictly kept in the `src\model\shared-models` folder (or sub-folders).
    - Shared files are ALWAYS copied from the server-side code to the client code (this application).
    - These files/folders should NOT BE MODIFIED in this client app without explicit instructions to do so.
      - **IMPORTANT** If you need to make changes in this folder, ask permission first, because the changes will have to be copied to the other project manually by the user.
  - Shard and non-shared content will sometimes refer to the `ObjectId` type, which is defined in the `mongodb` package.
    - The `mongodb` package is not actually installed in this project, because it cannot be used in the browser.
    - The `mongodb` library is declared in this project, and the `ObjectId` type is defined as a `string`.  This is proper.
    - When appropriate, use the `ObjectId` type instead of a `string` to ensure proper identification of the data's source, and potential required handling of the data.


---

- If you are unsure about a workflow or pattern, check the referenced files or ask for clarification. Keep changes modular and follow the observable/reactive patterns throughout the codebase.
- If a request or instruction is unclear, STOP and ask for clarification.  If the ambiguous information is not from user's instructions, then include a reference to the information you're unclear about.

