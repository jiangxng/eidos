# Eidos Enterprise Navigation & Information Architecture v0.1

**Status:** Normative navigation authority  
**Applies to:** Workbench, desktop/tablet/mobile navigation, App Host, plugin Experiences, Settings/admin areas, contextual tools and long-tail discovery

## 1. Core rule

> **Navigation is a deliberate discoverability projection, not a runtime capability inventory.**

A capability may be installed, active, routable and Agent-discoverable while intentionally having no persistent navigation entry.

## 2. Placement dimensions

Choose placement using:

- frequency;
- audience;
- scope;
- task intent;
- context dependence;
- risk/complexity;
- discoverability cost.

Do not choose menu depth from implementation ownership.

## 3. Canonical information layers

### A. Primary work navigation

For frequent Human work.

Examples: Work/Today, Applications, frequent business domains.

Keep it short and stable. Desktop normally targets about 3–7 durable primary destinations; mobile is stricter, normally about 3–5.

### B. Application/domain navigation

For work inside one selected business domain.

Examples:

- Sales → Orders / Customers / Returns
- Inventory → Stock / Inbound / Outbound
- Finance → Receivables / Payables / Close

### C. Business administration

For configuring how the enterprise operates.

Examples:

- Ledger management
- Posting/business rules
- Application definitions
- SOP/workflow governance
- organization/member/role structures
- enterprise business-definition lifecycle

Business administration is important but is not ordinary system Settings.

### D. Settings / system administration

For relatively stable, low-frequency platform configuration.

Recommended grouping:

```text
Personal
  Account
  Language
  Text size
  Notifications
  Appearance

Enterprise / Organization
  Enterprise profile
  Members and permissions
  Enterprise governance
  Data/storage policy

Applications & Extensions
  Installed applications
  Plugins / extensions
  Template Store
  Integrations

AI & Knowledge
  Model/provider configuration
  Memory governance
  Context/knowledge services
  EC connections

System
  Security
  Credentials
  Provider bindings
  Audit
  Scheduler
  System state

Advanced
  Diagnostics
  Runtime details
  Protocol/receipts
  developer/technical information
```

Settings MUST NOT become a dumping ground for normal task commands.

### E. Contextual professional tools

For specialist tools that only make sense while handling a relevant object/task.

Examples:

- graph viewer/designer;
- advanced condition editor;
- observatory;
- data lineage;
- cost/replay analysis;
- diagnostics for a selected object.

They remain installable, activatable, routable, Agent-callable and deep-linkable, but normally contribute no persistent global navigation.

### F. Long-tail discovery

For infrequent capabilities that do not deserve permanent menu space.

Use Search, Command Palette, App Finder / All applications or Agent discovery.

> **Menus support stable muscle memory; Search and Agent interaction support the long tail.**

## 4. Single-placement rule

The same destination SHOULD NOT appear simultaneously in multiple persistent navigation systems unless the duplicate serves a distinct proven Human goal.

In particular:

- Activity Bar is not a duplicate of the Applications list;
- a Settings destination should not also occupy primary work navigation;
- a contextual tool should not also appear as a permanent application unless it becomes a frequent independent task.

Recent/favorite shortcuts may duplicate a destination because they represent user history/preference, not a second information architecture.

## 5. Capability is not navigation

Keep these separate:

```text
Package installed
≠ Feature active
≠ Capability available
≠ Route exists
≠ Agent can discover it
≠ Navigation visible
```

Persistent navigation requires an explicit discoverability decision.

## 6. Business language first

Navigation labels are Human product language, not architecture vocabulary.

Prefer business terms such as Enterprise, Ledger Management, Applications & Extensions, Members & Permissions over Context IDs, Package identifiers, protocol versions or provider implementation names.

## 7. Settings versus business administration

Use this test:

**Would a manager use this to configure how the enterprise operates?**  
→ Business administration.

**Would an administrator use this occasionally to configure the platform itself?**  
→ Settings/system administration.

Examples:

- Ledger definitions → Business administration.
- Posting rules → Business administration.
- Plugin installation → Settings → Applications & Extensions.
- Provider credentials → Settings → System/AI.
- Memory governance infrastructure → Settings → AI & Knowledge.
- Runtime diagnostics → Settings → Advanced.

## 8. Direct manipulation versus Agent navigation

Navigation does not exist to maximize Agent usage.

If a Human can complete a frequent deterministic task faster through a button, menu, toggle, selection, short form or small drag/drop operation, the direct path SHOULD remain first-class.

Agent interaction is preferred where value comes from:

- natural-language intent;
- cross-person/team coordination;
- cross-company handoff;
- cross-application/system orchestration;
- information-island bridging;
- diagnosis/synthesis;
- planning;
- multi-step coordination;
- long-tail discovery.

The product MUST NOT convert a low-cost direct operation into a chat requirement merely because an LLM is available.

## 9. Role and context projection

The same capability graph may project differently for different authorized Humans.

Examples:

- warehouse worker: Today / Inbound / Outbound / Inventory;
- salesperson: Today / Customers / Sales / Receivables;
- manager: Work / Operations / Finance / Decisions;
- administrator: Work / Business Administration / Settings.

Projection may use current role/authority, current enterprise, installed applications, device Surface, explicit user pinning/favorites and stable usage evidence.

Do not silently reorder primary navigation continuously. Adaptation may recommend; durable primary placement should remain predictable and reversible.

## 10. Desktop versus mobile

Desktop may show more hierarchy simultaneously.

Mobile:

- keeps only highest-value primary destinations in bottom navigation;
- uses icon + visible short label;
- moves secondary destinations behind explicit More/Applications/Admin surfaces;
- uses contextual actions/sheets instead of permanent rails;
- preserves the same semantic placement class as desktop.

### 10.1 Help Center versus contextual help

Help has two distinct Experience shapes and they MUST NOT be conflated.

**Global Help Center**
- is a full information destination;
- owns search, browsing, categories, document lists and full help documents;
- opens in the Main Workspace on desktop/tablet;
- uses a full-screen/content-first realization on phone;
- MUST NOT be rendered wholesale inside a narrow Side Panel merely because Help is a secondary Activity.

**Contextual help**
- explains the current task, field, error, object or workflow;
- may use a Side Panel, popover, sheet or inline disclosure when that preserves the current task;
- should deep-link to the full Help Center when broader reading is needed.

The Workbench region follows Human intent, not icon placement: a secondary Activity may still open a primary Workspace Experience.

## 11. Contract direction

Long-term Experience navigation should declare semantic placement intent rather than only a flat order number.

Target vocabulary may include:

- PRIMARY_WORK
- APPLICATION
- BUSINESS_ADMIN
- SETTINGS
- CONTEXTUAL_TOOL
- LONG_TAIL

and optional parent/group identity, audience/role hints, frequency hint, mobile eligibility and search/Agent discoverability.

Until a versioned public contract supports these semantics, products should preserve this information architecture conservatively through existing contribution mechanisms rather than invent plugin-private menu systems.

## 12. Governance checklist

A fresh LLM adding a Human-facing capability MUST decide:

1. Does it need persistent navigation at all?
2. Which information layer owns it?
3. Is the label business-readable?
4. Is the same destination already persistently placed elsewhere?
5. Would contextual invocation be better?
6. Does it belong in Settings or business administration?
7. Can Search/Agent discover it without permanent chrome?
8. Can a direct control solve the Human goal more cheaply than Agent conversation?

If these questions are unanswered, adding a menu item is premature.
