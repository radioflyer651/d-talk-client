## Copilot Instructions: Chat Document Services

### Overview
The chat document services provide a modular, extensible system for managing chat-related documents (e.g., text documents, knowledge files) within the DTalk client. The system is designed for project-scoped, real-time collaboration and agent interaction with documents.

### Key Files and Classes
- `chat-documents.service.ts` (`ChatDocumentsService`): Main entry point for document management. Provides high-level APIs for loading, saving, and tracking documents in a project or chat room context. (File: `src/app/services/chat-core/chat-documents/chat-documents.service.ts`)
- `text-document.service.ts` (`TextDocumentService`): Handles text-based document operations (CRUD, content updates, etc). (File: `src/app/services/chat-core/chat-documents/text-document.service.ts`)
- `document-support-service.interface.ts` (`IDocumentSupportService`): Interface for document service implementations. All document service classes must implement this. (File: `src/app/services/chat-core/chat-documents/document-support-service.interface.ts`)
- `document-support-services.service.ts` (`DocumentSupportServicesService`): Registry and resolver for all available document support services. Used to obtain the correct service for a given document type. (File: `src/app/services/chat-core/chat-documents/document-support-services.service.ts`)

### Mechanics and Usage

- All document service implementations (e.g., `TextDocumentService` in `src/app/services/chat-core/chat-documents/text-document.service.ts`) must implement `IDocumentSupportService` from `src/app/services/chat-core/chat-documents/document-support-service.interface.ts`.
- Register new document services in `DocumentSupportServicesService` (in `src/app/services/chat-core/chat-documents/document-support-services.service.ts`) by adding them to its internal registry.
- To obtain a service for a specific document type, use:
	```typescript
	const service = documentSupportServicesService.getServiceForType(documentType); // DocumentSupportServicesService in src/app/services/chat-core/chat-documents/document-support-services.service.ts
	```
	This returns the correct implementation for the document type.

- Use `ChatDocumentsService` (in `src/app/services/chat-core/chat-documents/chat-documents.service.ts`) for all document CRUD operations.
- To load a document:
	```typescript
	chatDocumentsService.loadDocument(projectId, documentId) // ChatDocumentsService in src/app/services/chat-core/chat-documents/chat-documents.service.ts
		.subscribe(document => { /* handle loaded document */ });
	```
- To save or update a document:
	```typescript
	chatDocumentsService.saveDocument(projectId, document) // ChatDocumentsService in src/app/services/chat-core/chat-documents/chat-documents.service.ts
		.subscribe(result => { /* handle save result */ });
	```
- All methods return RxJS Observables. Always subscribe and handle completion/errors.

- Document state is managed reactively. Subscribe to document streams to receive updates:
	```typescript
	chatDocumentsService.getDocumentStream(documentId) // ChatDocumentsService in src/app/services/chat-core/chat-documents/chat-documents.service.ts
		.subscribe(document => { /* react to changes */ });
	```
- For collaborative editing, changes are propagated via the service and reflected in all subscribers.

- Use `TextDocumentService` (in `src/app/services/chat-core/chat-documents/text-document.service.ts`) for text-specific actions (e.g., content updates, formatting).
- To update text content:
	```typescript
	textDocumentService.updateContent(documentId, newContent) // TextDocumentService in src/app/services/chat-core/chat-documents/text-document.service.ts
		.subscribe(updatedDoc => { /* handle update */ });
	```
- Always use the service methods; do not mutate document objects directly.

- Implement `IDocumentSupportService` (in `src/app/services/chat-core/chat-documents/document-support-service.interface.ts`) for the new type.
- Register the new service in `DocumentSupportServicesService` (in `src/app/services/chat-core/chat-documents/document-support-services.service.ts`).
- Update `ChatDocumentsService` (in `src/app/services/chat-core/chat-documents/chat-documents.service.ts`) to route requests for the new type to the correct service.

- To display a document in a component, inject `ChatDocumentsService` (from `src/app/services/chat-core/chat-documents/chat-documents.service.ts`), call `loadDocument`, and subscribe to the result.
- For collaborative editing, subscribe to the document stream from `ChatDocumentsService` (in `src/app/services/chat-core/chat-documents/chat-documents.service.ts`) and update the UI on each emission.
- To support a new document type, implement and register a new service (see `IDocumentSupportService` in `src/app/services/chat-core/chat-documents/document-support-service.interface.ts` and `DocumentSupportServicesService` in `src/app/services/chat-core/chat-documents/document-support-services.service.ts`), then use the same consumption pattern as above.
- Always scope document operations to the current project and chat room as required by the service APIs.

- Never access or mutate document data directly; always use the provided service methods from `ChatDocumentsService` (in `src/app/services/chat-core/chat-documents/chat-documents.service.ts`) or `TextDocumentService` (in `src/app/services/chat-core/chat-documents/text-document.service.ts`).
- Use RxJS operators to manage subscriptions and avoid memory leaks (e.g., `takeUntil`, `async` pipe in templates).
- When adding new document features, ensure all service methods are project- and room-aware.

For further details, refer to the specific service and interface files listed above.
