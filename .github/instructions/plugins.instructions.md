# Plugin Parameter Editor Implementation Guide

## Overview

- **Plugins** are defined server-side, with their data models copied to the client in `src/model/shared-models/chat-core/plugins/`.
- Each plugin that requires user-editable parameters must have a dedicated Angular component for editing those parameters.
- All plugin parameter editor components are located in their own folder under:  
  `src/app/components/chat-core/plugins/plugin-params/PLUGIN-NAME-plugin-params/`

## Steps to Implement a Plugin Parameter Editor

1. **Create the Parameter Editor Component**
   - Create a new folder for your plugin under `plugin-params/` (e.g., `my-plugin-params/`).
   - Implement the Angular component (e.g., `my-plugin-params.component.ts`, `.html`, `.scss`).
   - The component should:
     - Use the appropriate model from `shared-models/chat-core/plugins/` for its `@Input() params`.
     - Provide a UI for editing all relevant fields of the params object.
     - Use Angular forms and PrimeNG controls for consistency.

2. **Register the Component in the Plugin Options Dialog**
   - Import your new component in `plugin-options-dialog.component.ts`.
   - Add your component to the `imports` array of the `@Component` decorator.
   - In `plugin-options-dialog.component.html`, add an `<app-my-plugin-params>` element, wrapped in an `*ngIf` that checks for your plugin's type.

3. **UI/UX Conventions**
   - Use PrimeNG components (e.g., `p-floatlabel`, `p-checkbox`, `p-inputText`, `p-textarea`) for all form controls.
   - Group related fields visually and provide clear labels.
   - If your plugin requires selection from other app data (e.g., agents), use services to load options and bind them to the UI.

4. **Parameter Binding**
   - The `params` input is always bound to the plugin's parameter object.
   - All changes should update the `params` object directly (two-way binding).

## Example Plugins

- See `plugin-params/drunk-plugin-params/` for a simple string parameter.
- See `plugin-params/ignore-specific-agent-plugin-params/` for a plugin that loads agent options from a service.
- See `plugin-params/label-memory-plugin-params/` for a plugin with multiple fields and custom logic.

## Dialog Integration

- All plugin parameter editors are surfaced in the UI via the `plugin-options-dialog` component.
- The dialog dynamically loads the correct editor based on the plugin type.

---

**Summary:**  
To add or update a plugin parameter editor, create a new component in `plugin-params/`, bind it to the correct model, and register it in the dialog. Follow the patterns in existing plugins for best practices.
