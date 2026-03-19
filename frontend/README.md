Angular-style frontend scaffold for a Keep-like notes app

Overview
- Minimal, standalone-component-focused scaffold demonstrating the layout and components for a note-taking app similar to Google Keep.

Notes
- This scaffold provides source files demonstrating Angular v20+ best-practices: standalone components (implicit), signals for state, computed for derived state, accessible markup, and OnPush change detection.
- To run this in a real environment, integrate the files under an Angular workspace created with the Angular CLI (ng new) or use an online editor that supports Angular v20+.

Files
- src/main.ts — app bootstrap
- src/app.component.ts — root app and layout
- src/topbar.component.ts — top bar with menu, logo, search, profile
- src/sidebar.component.ts — labels/tags, add label, archive, trash
- src/note-list.component.ts — notes grid (placeholder)
- src/styles.css — base styling

Accessibility
- Buttons and interactive elements include ARIA labels and keyboard focus management.
