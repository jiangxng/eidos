# ADR-0010: Help Document as a deterministic Eidos capability

**Status:** Accepted  
**Date:** 2026-09-26

## Context

Long-lived host products need an in-product Help surface that can render version-aware product knowledge without creating a second UI framework or allowing arbitrary documentation HTML/JavaScript inside the App Host.

Eidos owns generic frontend realization. It must not own EVO/App Platform product Help content, Package lifecycle, authorization policy, search indexing or enterprise knowledge.

## Decision

Eidos adds a generic `help-document` Experience capability.

A Help document is structured data:

```text
HelpDocumentV010
├─ identity / title / summary
├─ owner Package / optional Feature
├─ locale
├─ Help kind / audience
├─ applicability metadata
├─ breadcrumbs
├─ safe semantic blocks
└─ related documents
```

Supported P0 block types are:

- paragraph;
- heading;
- list;
- code;
- callout;
- steps.

Eidos validates and escapes all textual content before rendering.

Arbitrary executable HTML, script injection and document-owned JavaScript are not part of the Help contract.

## Navigation

Help document breadcrumb/related links may point to normal App Host routes.

Workbench Help discovery/search/navigation may reuse existing Eidos capabilities such as `catalog-browser` instead of introducing a duplicate list/search UI.

The Host owns Help index/search/context semantics and supplies Help pages through normal App Host manifests/page sources.

## Ownership

Eidos owns:

- Help document contract;
- safe rendering;
- Productive Design Language realization;
- accessibility/responsive behavior;
- semantic Help icon.

The Host/App Platform owns:

- Help aggregation;
- indexing/search;
- lifecycle;
- authorization filtering;
- context matching;
- product Help content.

Packages own the Help content for behavior and vocabulary they introduce.

## Localization

A Help document is already a locale-specific content variant.

Eidos does not translate Help body text at runtime. The Host selects the correct locale variant according to its localization policy and fallback chain.

Eidos does localize renderer-owned Help chrome (for example breadcrumb accessibility labels, Related, owner/review metadata, Help kind and audience labels) through the normal `LocalizationRuntime`. The rendered article declares the document locale with the HTML `lang` attribute.

`AppManagerExperienceSource` may propagate the active locale as a Host request hint for experience discovery and page loading. Hosts remain responsible for deterministic locale fallback and must not make stable route/document identity depend on whether a translation exists.

Machine identifiers, action codes and error codes remain stable across locales.

## Compatibility

`help-document@0.1.0` is additive and does not alter UIDL form, catalog, settings, chat or extension-manager contracts.

Unknown Help contract versions fail validation rather than being rendered approximately.

## Consequences

- Human Help and LLM-oriented product knowledge can share one structured source upstream.
- Host products can add Help without modifying Eidos rendering internals.
- Help remains backend-independent.
- Search/Agent/semantic retrieval can evolve independently of the document renderer.
