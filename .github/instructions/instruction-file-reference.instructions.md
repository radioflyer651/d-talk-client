---
applyTo: '**'
---

# Instruction File Reference

This file provides a comprehensive reference to all instruction files in the project, including when and how to use each one during development operations.

## How to Use This Reference

When working on any part of the codebase, consult this reference to determine which instruction files are relevant to your task. Each instruction file contains specific guidelines, patterns, and requirements for different aspects of the application.

---

## Instruction Files

### 1. `typescript-standards.instructions.md`
**Applies To:** `**/*.ts` (All TypeScript files)

**When to Use:**
- When creating or editing ANY TypeScript file in the project
- Before writing any new TypeScript code
- When reviewing code for standards compliance

**Purpose:**
Defines mandatory TypeScript coding standards including:
- Control structure formatting (always use blocks for `if` statements)
- Type usage (avoid `any`, prefer interfaces over classes)
- Import/export patterns (no default exports)
- Code organization (constructor placement, vertical whitespace)
- Commenting requirements (JSDoc, inline comments, TODO conventions)
- Value handling (prefer `undefined` over `null`)

**Key Rules:**
- Never use single-line `if` statements
- Use interfaces for data types, especially for shared client-server models
- Export items individually, never use default exports
- Add JSDoc comments to all functions/methods
- Use `TODO-Immediate:` for unfinished code, `TODO-Information:` for developer notes

---

### 2. `component-ts.instructions.md`
**Applies To:** `**/*.component.ts` (All Angular component TypeScript files)

**When to Use:**
- When creating a new Angular component
- When modifying existing component logic
- When adding service dependencies to components
- When managing component subscriptions and lifecycle

**Purpose:**
Provides Angular-specific component patterns including:
- Component structure and inheritance from `ComponentBase`
- Proper subscription management with `ngDestroy$` and `takeUntil`
- Service injection patterns
- Observable reuse and best practices
- Minimum component requirements

**Key Requirements:**
- All components must extend `ComponentBase` for automatic cleanup
- Use `takeUntil(this.ngDestroy$)` for all subscriptions
- Include constructor even if empty
- Components should NOT call API services directly (use context-specific services)
- `@Component` decorator must include: selector, imports (CommonModule, FormsModule), templateUrl, styleUrl

**Referenced Files:**
- `services.instructions.md` for frequently used services

---

### 3. `scss.instructions.md`
**Applies To:** `**/*.scss, **/*.html` (All style and template files)

**When to Use:**
- When creating or editing SCSS stylesheets
- When working with component templates that reference CSS classes
- When adding new styles or modifying existing ones

**Purpose:**
Defines styling conventions and guidelines including:
- Proper CSS class nesting based on HTML structure
- Global stylesheet references
- Bootstrap and Tailwind integration
- Naming conventions for CSS classes

**Key Rules:**
- CSS classes must be properly nested based on HTML containment
- Use lowercase with dashes for class names (e.g., `this-style-class`)
- Avoid creating new classes for existing Bootstrap, Tailwind, or PrimeNG elements
- Use Bootstrap classes and `src/layout.scss` for layout purposes

**Global Style Files to Consider:**
- `src/styles.scss`
- `src/layout.scss`
- `src/buttons.scss`

---

### 4. `api-clients.instructions.md`
**Applies To:** `src/app/services/chat-core/api-clients/*.ts`

**When to Use:**
- When working with API client services
- When adding new API endpoints
- When troubleshooting server communication
- When understanding the client-server interface

**Purpose:**
Documents the API client architecture including:
- `api-client-base.service.ts`: Base class for all API clients
- `api-client-internals.ts`: HTTP option building utilities
- `api-client.service.ts`: Main comprehensive API client (projects, agents, jobs, rooms, documents)
- `chatting-api-client.service.ts`: Specialized chat messaging client

**Key Information:**
- All API calls use `this.optionsBuilder.withAuthorization()` for JWT tokens
- All methods return RxJS Observables
- Use `ObjectId` type for entity IDs (aliased from MongoDB)
- Main client handles CRUD for: authentication, projects, agents, jobs, rooms, documents, models, voices
- Chatting client handles: send/update/delete messages, clear conversations

---

### 5. `services.instructions.md`
**Applies To:** `**/*` (All files, particularly components using services)

**When to Use:**
- When injecting services into components or other services
- When understanding application state management
- When working with projects, chat rooms, jobs, or agents
- When implementing reactive data flows

**Purpose:**
Documents frequently used Angular services including:
- **ProjectsService**: Project list and current project management
- **ChatRoomsService**: Chat room CRUD, agent/job instance management
- **ChatJobsService**: Job configuration management
- **ChattingService**: Message sending and chat history
- **ChatSocketService**: Real-time socket communication
- **ChatLinkingService**: Linking and lookup utilities for chat entities
- **PageSizeService**: Responsive UI based on window size

**Key Patterns:**
- Services maintain reactive state via observables (e.g., `projectListing$`, `currentProject$`)
- Use service methods to change state (e.g., `currentProjectId =` triggers updates)
- Subscribe to observable streams for reactive updates
- All services follow the RxJS pattern with `takeUntil` for cleanup

**Special Concepts:**
- `ChatJobLink`: Links job instance to configuration, room, and assigned agent
- See `src/model/chat-element-links.models.ts` for link definitions

---

### 6. `chat-documents.instructions.md`
**Applies To:** `**/*` (All files, particularly document-related services and components)

**When to Use:**
- When working with chat documents (text, knowledge files, etc.)
- When implementing new document types
- When building document UI components
- When managing document state or collaboration features

**Purpose:**
Documents the modular, extensible chat document system including:
- **ChatDocumentsService**: Main entry point for document management
- **TextDocumentService**: Text-specific document operations
- **IDocumentSupportService**: Interface for document service implementations
- **DocumentSupportServicesService**: Registry and resolver for document services

**Key Patterns:**
- All document services implement `IDocumentSupportService`
- Register new services in `DocumentSupportServicesService`
- Use `ChatDocumentsService` for all CRUD operations
- Document state is managed reactively via observables
- Never mutate document objects directly

**Usage Examples:**
```typescript
// Load document
chatDocumentsService.loadDocument(projectId, documentId)
  .subscribe(document => { /* handle */ });

// Save document
chatDocumentsService.saveDocument(projectId, document)
  .subscribe(result => { /* handle */ });

// Subscribe to document stream
chatDocumentsService.getDocumentStream(documentId)
  .subscribe(document => { /* react to changes */ });
```

---

### 7. `plugins.instructions.md`
**Applies To:** `**/*` (All files, particularly plugin-related components)

**When to Use:**
- When adding a new plugin to the application
- When creating plugin parameter editors
- When working with the plugin options dialog
- When implementing plugin UI components

**Purpose:**
Provides guidelines for implementing plugin parameter editors including:
- Component location: `src/app/components/chat-core/plugins/plugin-params/PLUGIN-NAME-plugin-params/`
- Registration in `plugin-options-dialog.component.ts`
- UI/UX conventions with PrimeNG components
- Parameter binding patterns

**Key Steps:**
1. Create parameter editor component in dedicated folder
2. Use `@Input() params` with appropriate model from `shared-models/chat-core/plugins/`
3. Import and register component in plugin-options-dialog
4. Add conditional rendering in dialog HTML
5. Use PrimeNG components for consistency

**Example Plugins:**
- `drunk-plugin-params/`: Simple string parameter
- `ignore-specific-agent-plugin-params/`: Plugin with service-loaded options
- `label-memory-plugin-params/`: Multiple fields with custom logic

---

### 8. `monaco-editor.instructions.md`
**Applies To:** `**/*` (All files working with Monaco Editor)

**When to Use:**
- When integrating Monaco Editor into components
- When configuring editor options or language support
- When handling editor events or lifecycle
- When troubleshooting editor instantiation issues

**Purpose:**
Documents the Monaco Editor integration approach including:
- Dynamic loading using `monacoLoader` from `src/types/monaco.typedevs.ts`
- Editor instantiation via direct DOM manipulation (not Angular templates)
- Configuration of editor options (language, wordWrap, fontSize, etc.)
- Event handling (content changes, language changes)
- Proper cleanup and disposal

**Key Patterns:**
```typescript
// Load Monaco
const monaco = await monacoLoader();

// Create editor
const editor = monaco.editor.create(container, options);

// Listen to changes
editor.onDidChangeModelContent(() => { /* handle */ });

// Cleanup
editor.dispose();
```

**Important Notes:**
- Monaco cannot be instantiated via Angular templates
- Always use async loader before creating editor instances
- Ensure Monaco assets are at `/assets/monaco/vs`
- Always dispose editor to prevent memory leaks

**Reference Implementation:**
- `src/app/components/monaco-editor/monaco-editor.component.ts`

---

### 9. `common-notes.instructions.md`
**Applies To:** `**/*` (All files)

**When to Use:**
- Check for general notes or future guidelines
- Currently empty but may contain project-wide notes in the future

**Purpose:**
Reserved for common notes and general guidelines that apply across the entire project.

**Current Status:**
No notes at this time.

---

### 10. `instruction-file-reference.instructions.md` (This File)
**Applies To:** `**` (All files)

**When to Use:**
- When starting work on any part of the codebase
- When unsure which instruction files apply to your current task
- As a quick reference guide to available instructions

**Purpose:**
Provides a comprehensive index and guide to all instruction files in the project, helping developers quickly find relevant guidelines for their work.

---

## Quick Reference Matrix

| Working On... | Read These Instructions |
|--------------|-------------------------|
| New TypeScript file | `typescript-standards.instructions.md` |
| Angular Component | `typescript-standards.instructions.md`, `component-ts.instructions.md`, `services.instructions.md`, `scss.instructions.md` |
| API Integration | `api-clients.instructions.md`, `services.instructions.md` |
| Styles/Templates | `scss.instructions.md` |
| Document Features | `chat-documents.instructions.md`, `services.instructions.md` |
| Plugin Features | `plugins.instructions.md` |
| Monaco Editor | `monaco-editor.instructions.md` |
| State Management | `services.instructions.md` |
| Any TypeScript | `typescript-standards.instructions.md` (always) |

---

## Best Practices for Using Instructions

1. **Always start with `typescript-standards.instructions.md`** when writing TypeScript code
2. **Check multiple files** - many tasks require consulting several instruction files
3. **Refer to examples** - instruction files often reference example implementations
4. **Follow the patterns** - instructions describe established patterns used throughout the codebase
5. **Update instructions** - if you discover gaps or inconsistencies, update the relevant instruction file

---

## File Locations

All instruction files are located in: `.github/instructions/`

Model references mentioned in instructions: `src/model/shared-models/`

Example implementations are referenced throughout the instructions and located in their respective feature folders under `src/app/components/` and `src/app/services/`.

