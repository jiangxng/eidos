# Eidos Design Research Sources v0.1

**Date reviewed:** 2026-09-28

This is the curated external research shelf for Eidos design evolution. It is intentionally small and authority-ranked.

## Tier 1 — direct product/design-system references

### VS Code UX Guidelines
- https://code.visualstudio.com/api/ux-guidelines/overview
- https://code.visualstudio.com/api/ux-guidelines/activity-bar
- https://code.visualstudio.com/api/ux-guidelines/sidebars
- https://code.visualstudio.com/api/ux-guidelines/panel
- https://code.visualstudio.com/api/ux-guidelines/views
- https://code.visualstudio.com/api/extension-capabilities/extending-workbench

Use for: Workbench anatomy, View Containers, Views, Activity Bar, contextual actions, extension UI discipline.

### Microsoft Fluent 2 / Windows app design
- https://fluent2.microsoft.design/layout
- https://fluent2.microsoft.design/content-engineering/design-interaction-behavior/
- https://learn.microsoft.com/en-us/windows/apps/design/app-settings/guidelines-for-app-settings

Use for: 4px spacing rhythm, alignment, responsive layout, visual grouping and hierarchy; explicit trigger/response/stop contracts for Agent interactions; turn progression that advances or cleanly closes a task; smart defaults; minimizing settings; keeping common workflow commands in task context; progressive disclosure for advanced configuration.

### IBM Carbon Design System
- https://carbondesignsystem.com/components/UI-shell-header/usage/
- https://carbondesignsystem.com/components/UI-shell-left-panel/usage/
- https://carbondesignsystem.com/components/UI-shell-right-panel/usage/
- https://carbondesignsystem.com/components/button/usage/
- https://carbondesignsystem.com/components/progress-indicator/usage/
- https://preview.carbondesignsystem.com/building-blocks/core/patterns/common-actions

Use for: enterprise shell semantics, productive density, one-primary-action hierarchy, direct common actions, multi-step current/completed/future state, validation before progression and explicit repair guidance.

### Apple Human Interface Guidelines
- https://developer.apple.com/design/human-interface-guidelines/design-principles
- https://developer.apple.com/design/human-interface-guidelines/settings
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://developer.apple.com/design/human-interface-guidelines/writing
- https://developer.apple.com/design/human-interface-guidelines/toolbars
- https://developer.apple.com/design/human-interface-guidelines/menus
- https://developer.apple.com/design/human-interface-guidelines/context-menus

Use for: purpose, agency, simplicity, good defaults, minimizing settings, keeping task-specific options in task context, direct navigation to needed settings, progressive disclosure, clear inline repair text, toolbar grouping and destructive-action separation.

## Tier 1 — accessibility/interaction standards

### W3C WAI-ARIA Authoring Practices
- https://www.w3.org/WAI/ARIA/apg/
- https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- https://www.w3.org/WAI/ARIA/apg/patterns/button/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/

Use for: focus, keyboard behavior, toolbar semantics and accessible controls; predictable focus movement; focus persistence/restoration after dialogs or destructive/state-changing actions.

## Tier 2 — HCI research community

### ACM SIGCHI
- https://sigchi.org/

### ACM CHI
- https://chi.acm.org/

### ACM UIST
- https://uist.acm.org/

Use for: long-term interaction research, human-centered AI, interface software, empirical findings and emerging patterns.

## Tier 3 — practitioner knowledge

### User Experience Stack Exchange
- https://ux.stackexchange.com/

Use for: recurring practical questions about button placement, icons, forms, navigation and conventions.

Community answers are evidence leads, not Eidos authority.

## Review cadence

Do not continuously chase trends.

Review this source shelf:
- when a new reusable Eidos interaction pattern is introduced;
- when usability evidence shows an existing pattern is weak;
- at major Eidos design-language revisions;
- periodically during architecture/design retrospectives.

Any adopted rule must be summarized into Eidos-owned guidance so future LLMs do not depend on external browsing for ordinary implementation.
