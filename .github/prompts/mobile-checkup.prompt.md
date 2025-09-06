---
mode: ask
---

# Mobile Usage Checkup Prompt for Angular Components

You are an agent tasked with reviewing the active file—an Angular component file (`.ts`, `.scss`, or `.html`)—for mobile usage suitability. The code you analyze may not be explicitly designed for mobile, and you should not assume any particular development practices are present. All analysis must be performed on the currently open (active) file in your editor, and you must only report issues that are directly observed in the file or in referenced global styles.

## Global Styles Consideration

When performing your review, you must also consider the impact of global styles defined in the following files (and any other global style files referenced in the project):

- `src/styles.scss`
- `src/layout.scss`
- `src/_style_variables.scss`
- `src/_mixins.scss`
- `angular.json`

### Important Components
The following are components that contain most application content. Take these into consideration to understand the present styling in effect.

  - `src\app\app.routes.ts` (Routes File)
  - `src\app\app.component` (component folder)
  - `src\app\components\app-home` (component folder)

You may reference these files directly in your findings, but only if you observe a concrete issue or risk in their content that affects the mobile suitability of the active file.

## Instructions

1. **Review the active file** (the one currently open in your editor, which may be a `.ts`, `.scss`, or `.html` Angular component file) for issues, risks, or missing features related to mobile usage.
2. **Use the checklist below** to guide your review. For each checklist item, only note issues that are directly observed in the code of the active file or in referenced global styles.
3. **Categorize each finding** using the tags defined in the "Categories and Tags" section.
4. **List your findings in order of priority**, with the most critical issues first.
5. **For each finding, provide a single secondary bullet** listing all relevant tags (from the defined set).
6. **All findings and analysis must be based on the content of the active file and referenced global styles. Do not warn about things you do not observe.**
7. **This Project Uses PrimeNG For Components** It does not have a pre-defined template however.

---

## Mobile Usage Checklist

- **Viewport Responsiveness**
  - Is the layout responsive to different screen sizes (e.g., uses relative units, media queries, or flex/grid layouts)?
  - Are there any fixed-width or height values that could cause overflow or clipping on small screens?
- **Touch Target Accessibility**
  - Are interactive elements (buttons, links, inputs) large enough and spaced appropriately for touch interaction?
  - Are there hover-only interactions that may not work on touch devices?
- **Font and Element Sizing**
  - Are font sizes and element dimensions set in relative units (em, rem, %, vw/vh) rather than absolute pixels?
  - Is text readable on small screens without zooming?
- **Scrolling and Overflow**
  - Are scrollable areas clearly indicated and usable on mobile?
  - Is horizontal scrolling avoided unless absolutely necessary?
- **Navigation and Menus**
  - Are navigation elements usable on small screens (e.g., collapsible menus, hamburger icons)?
  - Are modal dialogs and overlays mobile-friendly and dismissible?
- **Performance and Resource Usage**
  - Are there large images, heavy animations, or unnecessary scripts that could impact mobile performance?
- **Device Features and Compatibility**
  - Are mobile device features (e.g., virtual keyboard, orientation changes) handled gracefully?
  - Are there any desktop-only features or assumptions?
- **Accessibility**
  - Are ARIA attributes, labels, and roles present for interactive elements?
  - Is color contrast sufficient for readability on mobile devices?
- **Testing and Fallbacks**
  - Are there any fallbacks or alternative flows for unsupported features on mobile browsers?

---

## Categories and Tags

Use the following tags to categorize each finding. Each finding should include all relevant tags.

- **[CRITICAL]**: Issues that prevent basic use of the component on mobile devices (e.g., unusable layout, inaccessible controls).
- **[MAJOR]**: Issues that significantly degrade the mobile experience but do not make the component unusable (e.g., poor readability, difficult navigation).
- **[MINOR]**: Minor usability or polish issues that do not block use (e.g., small touch targets, minor overflow).
- **[ENHANCEMENT]**: Opportunities for improvement or best practices not currently implemented (e.g., could use better responsive units, more accessible markup).
- **[COMPATIBILITY]**: Issues or risks related to specific devices, browsers, or OS versions.
- **[PERFORMANCE]**: Issues that may impact performance on mobile devices.
- **[ACCESSIBILITY]**: Issues specifically related to accessibility for users with disabilities.

**Definitions:**
- **CRITICAL**: Must be fixed for mobile usability.
- **MAJOR**: Should be fixed for a good mobile experience.
- **MINOR**: Nice to fix, but not required.
- **ENHANCEMENT**: Not a bug, but a recommended improvement.
- **COMPATIBILITY**: Device/browser-specific concerns.
- **PERFORMANCE**: Resource usage concerns.
- **ACCESSIBILITY**: Affects users with disabilities.

---

## Response Format

- List findings in order of priority (highest first).
- For each finding:
  - Provide a brief description of the observed issue.
  - Add a secondary bullet with all relevant tags (from the list above).

**Only report issues that are directly observed in the active file or referenced global styles. Do not include warnings or tasks for things that are not present or cannot be determined from the code.**

**Example:**

1. Button labels are truncated on screens narrower than 400px due to a fixed width set in `component.scss`.
   - Tags: [CRITICAL], [COMPATIBILITY]
2. Touch targets for menu items are smaller than recommended minimum size (observed in `.menu-item` class).
   - Tags: [MAJOR], [ACCESSIBILITY]
3. Uses px units for font sizes instead of rem or em in `src/styles.scss`.
   - Tags: [ENHANCEMENT]

---

**Begin your review after this line.