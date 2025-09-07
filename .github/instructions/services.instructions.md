### Page Size Service
**File:** `src/app/services/page-size.service.ts`

**Purpose:**
Provides observables for the current browser window size and whether the page is considered "skinny" (narrow), enabling responsive UI behavior throughout the application.

**Features:**
- Emits the current page size (`pageResized$`) as an observable of `{ width, height }` objects, updating on window resize.
- Exposes a reactive boolean (`isSkinnyPage$`) and value (`isSkinnyPage`) indicating if the page width is 768px or less.
- Designed for use in components and services that need to react to page size changes or adapt layouts responsively.

**Usage:**
- Subscribe to `pageResized$` to get the latest window size.
- Use `isSkinnyPage$` or `isSkinnyPage` to adjust UI for narrow screens (e.g., hide gutters, change layouts).


# Frequently Used Angular Services

## Notes
  - Services are located in the `src\app\services` folder.
  - The `src\app\services\chat-core` folder holds service specific to the core operations of this application.
    - More generalized services that could theoretically be used in other projects are in the parent folder.
  - The `src\app\services\chat-core\api-clients` holds services for API clients.
    - This construct was built later in the development process and is not as well organized as it could be.

## General Services Notes
  - See the [Chat Document Services Instructions](./chat-documents.instructions.md) for information about related services to `ChatDocument` and `TextDocument`s.


## Specific Services

### Projects Service
**File:** `src/app/services/chat-core/projects.service.ts`

**Purpose:**
Manages the list of projects and the current project context for the application.

**Features:**
- Loads and maintains a reactive list of all projects (`projectListing$`).
- Tracks and exposes the current project (`currentProject$`, `currentProjectId$`).
- Provides methods to create and delete projects, automatically updating the project list.

**Usage:**
- Subscribe to `projectListing$` to get the current list of projects.
- Set `currentProjectId` to change the active project; `currentProject$` will update reactively.
- Use `createProject(name)` and `deleteProject(id)` to manage projects; these will trigger list reloads.

### Chat Rooms Service
**File:** `src/app/services/chat-core/chat-rooms.service.ts`

**Purpose:**
Manages chat rooms for the current project, including CRUD operations, job/agent assignments, and room selection.

**Features:**
- Loads and maintains a reactive list of chat rooms for the selected project (`chatRooms$`).
- Tracks the selected chat room (`selectedChatRoom$`, `selectedChatRoomId`).
- Provides methods to create, delete, and update chat rooms.
- Supports agent and job instance management within rooms (assign, remove, reorder, etc).

**Usage:**
- Subscribe to `chatRooms$` for the current project's rooms.
- Set `selectedChatRoomId` to change the active room; `selectedChatRoom$` will update.
- Use `createChatRoom`, `deleteChatRoom`, and related methods for room management.
- Use agent/job instance methods to manage assignments and ordering within a room.

### Chat Jobs Service
**File:** `src/app/services/chat-core/chat-jobs.service.ts`

**Purpose:**
Manages chat job configurations for the current project, including CRUD operations and selection.

**Features:**
- Loads and maintains a reactive list of chat jobs for the selected project (`jobs$`).
- Tracks the selected job (`selectedJob$`, `selectedJobId`).
- Provides methods to create, update, and delete jobs.

**Usage:**
- Subscribe to `jobs$` for the current project's jobs.
- Set `selectedJobId` to change the active job; `selectedJob$` will update.
- Use `createJob`, `updateJob`, and `deleteJob` for job management.

### Chatting Service
**File:** `src/app/services/chat-core/chatting.service.ts`

**Purpose:**
Handles chat message sending, chat history management, and message updates for the selected chat room.

**Features:**
- Maintains the current chat room and its chat history (`chatHistory$`).
- Provides methods to send, update, and delete chat messages.
- Supports clearing all messages in a room and refreshing/reloading chat history.

**Usage:**
- Use `sendChatMessage(message)` to send a message to the current room.
- Use `chatHistory$` to subscribe to the current room's chat history.
- Use `updateChatMessageInChatRoom` and `deleteChatMessageInChatRoom` for message management.
- Use `clearMessages`, `refreshChatHistory`, and `reloadChatHistory` as needed.

### Chat Socket Service
**File:** `src/app/services/chat-core/chat-socket.service.ts`

**Purpose:**
Manages real-time socket communication for chat rooms, including joining/leaving rooms and handling incoming message chunks.

**Features:**
- Automatically joins/leaves chat rooms as the selected room changes.
- Handles incoming message chunk events and updates chat history accordingly.
- Rejoins rooms on socket reconnect.

**Usage:**
- Service is initialized automatically; no direct method calls are typically needed.
- Relies on `ChatRoomsService` and `ChattingService` for room and message state.

### Chat Linking Service
**File:** `src/app/services/chat-core/chat-linking.service.ts`

**Purpose:**
Provides linking and lookup utilities for chat rooms, jobs, agent instances, and agent configurations.

**Features:**
- Aggregates and links chat rooms, agent instances, agent configurations, and job instances for the current project.
- Provides methods to get job/agent links and resolve relationships.
- Exposes a reactive stream of job links (`jobLinks$`).

**What is a JobLink (`ChatJobLink`)?**
- A `ChatJobLink` is an object that links a specific chat job instance to its configuration, the chat room it belongs to, and the agent assigned to it. This structure is used throughout the linking service to provide a unified view of job relationships.
- See: `src/model/chat-element-links.models.ts` for the `ChatJobLink` and `ChatAgentLink` interface definitions.

**Usage:**
- Use `jobLinks$` to subscribe to the current set of job links.
- Use `getJobForId`, `getAgentConfigsForJob`, and `getAgentInstanceForJob` for lookups.

