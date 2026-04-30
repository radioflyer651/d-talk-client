---
applyTo: 'src/app/services/chat-core/api-clients/*.ts'
---

# API Clients
The following is information about the API clients of this Angular project.

## Architecture Overview
The API client architecture is organized into four main files, with a clear separation of concerns:
- **Base Service:** Provides common functionality for all API clients (URL construction, token parsing)
- **Internals/Utilities:** HTTP request option building and type definitions
- **Main API Client:** Comprehensive service covering all major CRUD operations for the application
- **Specialized Client:** Focused on real-time chat messaging operations

## Specific Clients

### `api-client-base.service.ts`
**Purpose:** Base class providing core functionality shared by all API client services.

**Key Responsibilities:**
- Constructs full API URLs by combining paths with the base URL from environment configuration
- Provides token parsing functionality to decode JWT tokens into `TokenPayload` objects
- Initializes and exposes an `HttpOptionsBuilder` instance for constructing HTTP request options
- Injects `HttpClient` and `TokenService` dependencies that all derived services need

**Usage Pattern:** Extended by `ClientApiService` and `ChattingApiClientService` to inherit common API functionality.

### `api-client-internals.ts`
**Purpose:** Internal utilities and type definitions for building HTTP request options.

**Key Responsibilities:**
- Defines TypeScript types extracted from `HttpClient` method signatures for type safety
- Exports `HttpCallOptions` as a union type for GET and POST request options
- Implements `HttpOptionsBuilder` class that provides a fluent interface for building request options
- Implements `OptionsBuilderInternal` class that handles the actual construction of HTTP headers
- Provides convenient `withAuthorization()` method to automatically add JWT token to request headers

**Usage Pattern:** Used internally by API client services to construct properly formatted HTTP request options with authentication headers.

### `api-client.service.ts` (ClientApiService)
**Purpose:** Primary API client service handling all major CRUD operations for the application's core entities.

**Key Responsibilities:**

#### Authentication & User Management
- User login and registration (sets JWT token on success)
- User logout (clears JWT token)
- Token parsing for authentication state

#### Project Management
- Get project listings for current user
- CRUD operations for projects (create, read, update, delete)
- Update project knowledge stores

#### Agent Configuration Management
- Get all agent configurations for a project
- CRUD operations for agent configurations
- Set disabled state for agent instructions and identity messages

#### Agent Instance Management
- CRUD operations for agent instances
- Get agent instances by ID, by identity, or by chat room
- Bulk fetch agent instances by array of IDs
- Create/delete agent instances in specific chat rooms
- Assign/remove agents from job instances

#### Chat Job Management
- Get all jobs for a project
- CRUD operations for job configurations
- Set disabled state for job instructions
- Create/delete job instances in chat rooms
- Configure job instance properties (disabled state, message visibility, order)
- Assign/remove agents from job instances

#### Chat Room Management
- Get all chat rooms for a project
- CRUD operations for chat rooms
- Update chat room name, instructions, and document permissions
- Create/delete agent and job instances within rooms

#### Document Management
- Get all chat documents for a project
- CRUD operations for chat documents
- Get lightweight document list items for UI display
- Update chat room document permissions

#### Model Configuration Management
- CRUD operations for Ollama model configurations
- Get all or individual Ollama model configurations

#### Voice & Audio Features
- Get available Hume AI voices (custom or AI-generated)
- Request voice message URLs for specific chat messages

**Usage Pattern:** Injected into components and other services as `ClientApiService`. The primary interface for all server communication except real-time chat messaging.

### `chatting-api-client.service.ts`
**Purpose:** Specialized API client focused exclusively on chat messaging operations.

**Key Responsibilities:**

#### Message Operations
- Send chat messages to a specific chat room
- Update existing chat message content
- Delete individual chat messages
- Delete a message and all messages after it (branch deletion)

#### Conversation Management
- Clear entire conversation history for a chat room

**Usage Pattern:** Injected into chat-related components and services as `ChattingApiClientService`. Provides a focused interface for real-time chat operations, separate from the main API client for better code organization and maintainability.

**Design Rationale:** Separating chat operations into a dedicated service allows for:
- Clear separation of concerns between entity management and real-time messaging
- Easier maintenance and testing of chat-specific functionality
- Potential for different error handling or retry logic for real-time operations
- Simpler interface for components that only need chat messaging capabilities

## Common Patterns

### Authorization
All API calls (except login/register) use `this.optionsBuilder.withAuthorization()` to automatically include the JWT token in request headers.

### Observable Responses
All methods return RxJS Observables that emit the server response and complete. Components should subscribe using `takeUntil(this.ngDestroy$)` for automatic cleanup.

### Type Safety
All API methods use strongly-typed interfaces from `src/model/shared-models/` for request and response payloads, ensuring type safety across client-server communication.

### ID Parameters
All entity IDs use the `ObjectId` type (aliased from MongoDB) for proper type identification, even though the actual runtime type is `string` in the browser.

