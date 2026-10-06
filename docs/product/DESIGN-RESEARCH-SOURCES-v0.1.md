# Eidos Design Research Sources v0.1

**Date reviewed:** 2026-10-06

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

## Tier 1 — Human-AI interaction and mixed initiative

### Ben Shneiderman — Direct Manipulation
- https://doi.org/10.1145/238218.238281

Use for: the long-standing HCI principle that interfaces should remain comprehensible, predictable and controllable through direct manipulation. Eidos applies this to frequent deterministic enterprise work: if a Human can safely act directly at lower effort than describing intent, preserve the direct path.

### Eric Horvitz — Mixed-Initiative User Interfaces
- https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/
- https://doi.org/10.1145/302979.303030

Use for: coupling intelligent automation with direct manipulation rather than treating Agent automation and graphical interaction as mutually exclusive. Eidos uses mixed initiative as a design lens: Human and Agent each contribute where they are strongest, at the appropriate time.

### Microsoft Research — Guidelines for Human-AI Interaction
- https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/overview/
- https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/

Use for: capability expectation-setting, context-aware timing, efficient invocation/dismissal, correction, control and behavior over time. The 18 guidelines were synthesized from prior Human-AI research and validated with design practitioners.

### Google People + AI (PAIR) Guidebook
- https://pair.withgoogle.com/guidebook-v2/
- https://pair.withgoogle.com/guidebook-v2/chapters
- https://pair.withgoogle.com/guidebook-v2/case-studies

Use for: deciding whether AI actually adds user value, Human mental models, explainability, feedback/control, graceful failure, supervision of automation and returning control to the Human when automation fails.

### Microsoft 365 Copilot extensibility UX guidance
- https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-ui-widgets-guidelines

Use for: conversational experiences should add value that is difficult or inefficient in traditional navigation, expose focused atomic capabilities instead of rebuilding the whole application inside chat, and preserve Human control.

### Apple Human Interface Guidelines — Generative AI
- https://developer.apple.com/design/human-interface-guidelines/generative-ai

Use for: AI is not automatically appropriate for every feature; apply it where it creates clear value such as time savings, better communication or creativity, keep people in control, allow refinement/revert/retry, and retain non-AI paths where practical.

Eidos synthesis:

> Direct manipulation, guided workflows and Agent interaction form a continuum. Choose the lowest-effort interaction that preserves Human clarity, control and enterprise governance. Agent usage is justified by reasoning, ambiguity, synthesis and coordination value—not by novelty.

## Tier 1 — professional canvas / diagram / map interaction

### Figma canvas navigation
- https://help.figma.com/hc/en-us/articles/360041065034-Adjust-your-zoom-and-view-options
- https://help.figma.com/hc/en-us/articles/15297425105303-Explore-design-files

Use for: canvas-first task area, initial zoom-to-fit, direct pan/zoom, zoom-to-selection, keyboard/trackpad navigation, and keeping canvas zoom separate from general UI scale.

### Miro canvas controls
- https://help.miro.com/hc/en-us/articles/20967864443410-Miro-s-new-simplified-user-interface

Use for: separating content/business tools from a compact canvas control bar, placing zoom/navigation controls at the canvas edge, and progressively disclosing secondary map/navigation options.

### Mapbox GL JS interaction
- https://docs.mapbox.com/mapbox-gl-js/guides/user-interactions/gestures/
- https://docs.mapbox.com/mapbox-gl-js/example/cooperative-gestures/
- https://docs.mapbox.com/mapbox-gl-js/api/markers/

Use for: map-like pan/zoom gesture consistency across mouse/touch, compact navigation controls, interaction ownership, and avoiding accidental navigation/zoom conflicts.

### Lucidchart shapes and lines
- https://help.lucid.co/hc/en-us/articles/16390096079764-Add-and-customize-shapes-in-Lucidchart

Use for: restrained shape fill/border hierarchy, line width/style as information hierarchy, and keeping diagram appearance systematic instead of decorating each object independently.

Eidos synthesis:

> Professional business diagrams should behave more like calm map/design canvases than like large forms: maximize the canvas, keep navigation controls compact, progressively disclose detail, and use selection to reduce visual noise around dense relationships.

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
