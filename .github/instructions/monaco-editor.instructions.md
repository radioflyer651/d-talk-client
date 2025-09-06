# Monaco Editor Integration Instructions

## Overview
The Monaco Editor is integrated into this project to provide a rich, in-browser code editing experience. Due to the nature of Monaco Editor's API and its requirements, it cannot be instantiated using standard Angular component techniques. Instead, a specialized approach is used to load, configure, and interact with the editor.

## Key Files
- **Type Definitions and Loader:**
  - `src/types/monaco.typedevs.ts`
    - Exports types for Monaco Editor services and the `monacoLoader` async function.
    - Handles dynamic loading and configuration of the Monaco Editor library using `@monaco-editor/loader`.

## Loading and Instantiating Monaco Editor
- **Dynamic Loading:**
  - The editor is loaded asynchronously using the `monacoLoader` function from `src/types/monaco.typedevs.ts`.
  - This function configures the loader with the correct path to the Monaco assets and returns the initialized Monaco service.
  - Example usage:
    ```typescript
    import { monacoLoader } from 'src/types/monaco.typedevs';
    const monaco = await monacoLoader();
    ```

- **Editor Creation:**
  - The Monaco Editor instance is created by calling `monaco.editor.create(container, options)`.
  - The container is a DOM element reference (not an Angular template reference variable).
  - Editor options such as `value`, `language`, `automaticLayout`, `wordWrap`, and `fontSize` are provided at creation.

- **Why This Approach:**
  - Monaco Editor cannot be instantiated via Angular's template system because it requires direct DOM manipulation and asynchronous loading.
  - The loader ensures the editor is only initialized after the DOM is ready and the Monaco library is fully loaded.

## Editor Options and Language Support
- **Options:**
  - Editor options are passed at creation and can be updated later using `editor.updateOptions()`.
  - Supported options include language, word wrap, font size, and more.

- **Language List:**
  - The available languages are retrieved from `monaco.languages.getLanguages()`.
  - This allows dynamic population of language selection UIs.

## Event Handling
- **Content Changes:**
  - Listen to `editor.onDidChangeModelContent` to react to content edits.
- **Language Changes:**
  - Listen to `editor.onDidChangeModelLanguage` to handle language switching.

## Cleanup
- **Disposal:**
  - Always call `editor.dispose()` when the editor is destroyed to prevent memory leaks.

## References
- **Type Definitions and Loader:**
  - `src/types/monaco.typedevs.ts`
- **Example Usage:**
  - See the implementation in `src/app/components/monaco-editor/monaco-editor.component.ts` for practical integration details.

## Notes
- Never instantiate Monaco Editor directly in Angular templates.
- Always use the loader and dynamic DOM-based instantiation as shown above.
- Ensure the Monaco assets are available at the configured path (`/assets/monaco/vs`).
