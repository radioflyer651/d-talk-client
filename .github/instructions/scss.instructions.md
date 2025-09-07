---
applyTo: '**/*.scss, **/*.html'
---

# Styles

## Explanation
  - The project uses SCSS for CSS styling.
  - The project is an Angular project, and any SCSS or HTML files for components will have matching files in the same folder for the current file.

## Global Style Sheets
Styles found in the following files should be considered to exist in the current style sheet.  Read these files into context first.
  - `src/styles.scss`
  - `src/layout.scss`
  - `src/buttons.scss`

## Bootstrap and Tailwind
The project also has references to bootstrap and tailwind.  Any classes defined by those should be ignored, and considered to exist in the current style sheet.

## Rules & Instructions
  - CSS classes must be properly nested based on containment in the HTML document.
    - Reference the corresponding HTML document for this determination if/when needed.
  - If a class is used under multiple parent classes, then place the class under the lowest common parent of those usages.
  - Avoid creating new classes for styles in the global style files or bootstrap or tailwind.
  - Avoid creating new classes for known elements of PrimeNG, if not needed.
  - styles must be all lowercase with dashes.  I.e. `this-style-class`
  - Use bootstrap classes for layout purposes, as well as classes found in the `src/layout.scss` file.
  