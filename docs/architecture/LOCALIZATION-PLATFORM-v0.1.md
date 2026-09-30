# Localization Platform Baseline v0.1

Status: Implemented baseline  
Owner: Eidos  
Scope: localization runtime, platform chrome, renderer/mount context

## Ownership boundary

Eidos owns localization infrastructure and Eidos-owned platform text.

Plugin/package text remains owned by the plugin/package.

Runtime and enterprise business data remain literal unless their owning system explicitly provides presentation semantics. Eidos does not infer or translate business meaning.

## Platform contract

Human-visible values can be declared as either:

- literal text;
- localized message references with namespace, key, fallback and parameters.

The runtime exposes deterministic resolution plus message-presence checks. Existing literal fallback behavior remains compatible.

## Rendering rule

Eidos-owned renderer and mounted-runtime chrome receive the same LocalizationRuntime.

A render path must not localize platform chrome only during initial HTML generation and then revert to raw platform strings after mounting or refresh.

## Spatial Observatory baseline

Spatial platform chrome now resolves through Eidos localization resources, including:

- selection chrome;
- empty-selection prompt;
- scene instructions;
- reset-view control;
- revision label;
- loading/ready/failure status;
- scene accessibility label.

Page titles, read-preset labels, object labels, observations, notices and other plugin/runtime supplied values remain untouched in this stage.

## Required locales

First-class Eidos App Host bundles retain exact key parity for:

- en
- zh-CN
- ja
- zh-TW

Tests enforce parity and Spatial platform-key presence.

## Invariants

Governed by EIDOS-18, EIDOS-19, EIDOS-39 and EIDOS-40.
