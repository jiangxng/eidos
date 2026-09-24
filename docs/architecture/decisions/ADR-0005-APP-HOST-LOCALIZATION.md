# ADR-0005: App Host localization contract and app-owned language resources

**Status:** Accepted  
**Date:** 2026-09-24

## Context

Eidos currently renders human-facing strings directly from UIDL, Catalog Browser documents and App Host manifests. The first EVO `evo-localization` package registered provider descriptors, but App Host had no locale context, text-reference contract or resource-bundle resolver. Installing that package therefore could not change rendered text.

The platform also needs to avoid a central translation plugin becoming the owner of every application's vocabulary.

## Decision

Localization is split into four responsibilities:

```text
Eidos / App Host
  defines localization contracts + locale-aware rendering
            │
            ├── current locale / fallback chain
            ├── text resolution
            └── number/date/currency formatting hooks
            │
            ▼
Each Experience / plugin
  owns its own localization namespace and resources
            │
            ▼
Optional locale/policy provider
  selects/persists locale and regional policy
```

### Eidos owns the standard, not product translations

Eidos owns generic frontend semantics:

- `LocalizedText` references;
- `LocalizationBundle` schema;
- locale context;
- deterministic fallback behavior;
- locale-aware render hooks;
- missing-key diagnostics;
- resource namespace isolation.

Eidos does **not** own business/product translation content.

### Each plugin owns its language resources

An installable plugin that renders human-facing text owns the translations for its own namespace.

Example:

```text
package: evo-ledger-runtime-configurator
namespace: evo-ledger-runtime-configurator

zh-CN:
  nav.label = 账本配置
  page.title = EVO 账本运行时配置
  action.validate = 校验配置

en:
  nav.label = Ledger Configurator
  page.title = EVO Ledger Runtime Configurator
  action.validate = Validate configuration
```

Disabling/uninstalling a plugin removes its active Experience and its active localization bundles together.

### Optional locale providers do not own other plugins' vocabulary

A locale provider may own:

- persisted user locale;
- enterprise/workspace locale defaults;
- allowed locale policy;
- regional formatting preferences;
- future translation-service integration.

It MUST NOT become the canonical store for unrelated plugin UI strings.

## Contract v0.1

### LocalizedText

Backward-compatible literal strings remain valid.

A localized text reference is:

```ts
type LocalizedTextV010 =
  | string
  | {
      key: string;
      fallback: string;
      params?: Record<string, string | number | boolean | null>;
    };
```

Rules:

1. `key` is stable semantic identity, not the displayed translation.
2. `fallback` is mandatory so UI remains deterministic when a bundle/key is unavailable.
3. Parameters are data, never executable expressions.
4. Consumers never display the raw key as user-facing fallback.

### LocalizationBundle

```ts
interface LocalizationBundleV010 {
  contractVersion: "0.1.0";
  namespace: string;
  locale: string;
  messages: Record<string, string>;
}
```

App Platform SHOULD enforce `namespace === packageId` for ordinary packages.

### Locale context

```ts
interface LocaleContextV010 {
  locale: string;
  fallbackLocales: string[];
}
```

Initial browser-host fallback:

```text
explicit host/user choice
→ browser locale
→ product default
→ LocalizedText.fallback
```

Enterprise/user providers may later insert governed preferences ahead of browser locale.

## Deterministic resolution

Given `namespace`, `LocalizedText`, and locale context:

1. literal string → return literal;
2. lookup `current locale + namespace + key`;
3. lookup fallback locales in declared order;
4. return `fallback`;
5. emit diagnostic for missing resource where observability is enabled.

Resolution order MUST NOT depend on package load order.

## Namespace and collision rules

Localization resource keys are namespaced.

```text
<namespace>:<key>
```

For an ordinary package:

```text
namespace == packageId
```

Cross-package language-pack extensions are a future explicit capability and MUST NOT silently override another package's bundle.

## Formatting

Translation and formatting are related but separate.

Eidos renderer uses locale context for generic presentation of:

- dates;
- numbers;
- percentages;
- currencies when the semantic value includes a currency code.

Business values remain authoritative data from the host/backend. Localization never changes business meaning.

## Errors and diagnostics

Backend errors should prefer stable codes + parameters over fully rendered English/Chinese sentences when intended for UI display.

App Host or owning plugin may localize known error codes. Unknown server messages remain diagnostic fallback.

## LLM boundary

LLM output language is not a localization bundle. An Agent may answer in the user's locale/language, but deterministic UI chrome and application vocabulary still resolve through Eidos localization contracts.

## Acceptance

Localization is considered implemented only when:

1. App Host has a current locale;
2. changing locale changes host/app text without reinstalling code;
3. at least two independent plugins provide their own bundles;
4. disabling a plugin removes its resources;
5. missing translations fall back deterministically;
6. Eidos works without EVO and without a locale provider;
7. no central localization plugin owns all product strings.
