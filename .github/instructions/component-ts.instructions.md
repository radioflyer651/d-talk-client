---
applyTo: '**/*.component.ts'
---

  - See the [Frequently Used Services](./services.instructions.md) file for information about commonly used services in components.

# Instructions for Angular Component (TypeScript) files.

## General Instructions
  - Components should derive from the `ComponentBase` class, found at `src\app\components\component-base\component-base.component.ts`.
    - The `ComponentBase` implements the `ngOnDestroy` method, which will trigger the `ngDestroy$` observable.
  - The `ngDestroy$` observable should be used with `takeUntil` for all observables created or used in a the component to ensure proper cleanup.
  - Components almost never use API calls directly (through the `ClientApiService`).
    - Typically, context-specific services are used to perform operations that involve API calls.
  - When appropriate, services should be included in the component to work with data in the application.
    - Services provide persistent state to the application, as well as retrieval and updating of the data in the server.
  - Reuse observables whenever possible.
    - Only subscribe to `Observable` instances.  Use the `asObservable()` method when needed to avoid subscribing directly to more capable source implementations.
  - Inject services into the constructor preemptively, based on context.  It's easier to delete than to add them later.
  
## Minimum Component Requirements
All components should include the following in their `.ts` file.
  - A `constructor` should always be included, even if it's empty and has no dependencies.
  - Always derive from the `ComponentBase` class.
  - The `@Component` decorator must always include the following:
    - `selector`
    - `imports` array with the following modules:
      - `CommonModule`
      - `FormsModule`
    - `templateUrl` referencing the HTML template for the component.
      - Create the file if it doesn't exist.  Use the same name as the `.ts` file, except with `.html`.
    - `styleUrl` referencing the style's url for the component.
      - Create the file if it doesn't exist.  Use the same name as the `.ts` file, except with `.scss`.
    