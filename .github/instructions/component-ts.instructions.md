---
applyTo: '**/*.component.ts'
---

  - See the [Frequently Used Services](./services.instructions.md) file for information about commonly used services in components.

# Instructions for Angular Component (TypeScript) files.
  - Components should derive from the `ComponentBase` class, found at `src\app\components\component-base\component-base.component.ts`.
    - The `ComponentBase` implements the `ngOnDestroy` method, which will trigger the `ngDestroy$` observable.
  - The `ngDestroy$` observable should be used with `takeUntil` for all observables created or used in a the component to ensure proper cleanup.
  - Components almost never use API calls directly (through the `ClientApiService`).
    - Typically, context-specific services are used to perform operations that involve API calls.
  - When appropriate, services should be included in the component to work with data in the application.
    - Services provide persistent state to the application, as well as retrieval and updating of the data in the server.
  