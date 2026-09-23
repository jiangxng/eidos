# Eidos Core, Component Library and App Host v0.1

**Status: TARGET ARCHITECTURE**  
**Date: 2026-09-23**

## 1. Product Definition

Eidos is a pure, LLM-native frontend framework.

It does not own enterprise business truth, enterprise persistence, accounting semantics, workflow semantics, or backend execution.

Eidos is organized into three long-term parts:

```text
Eidos
├─ Core
├─ Component Library
└─ App Host
```

Examples / Showcase are validation assets, not a fourth production layer.

## 2. Eidos Core

Core answers:

> How is a declarative frontend experience validated, normalized, bound and rendered?

Core owns generic frontend runtime concerns:

- UIDL / Page contract;
- validation;
- render model;
- frontend/local state;
- data binding contracts;
- action binding contracts;
- component resolution;
- renderer runtime;
- diagnostics;
- deterministic behavior.

Core does not know Sales, Inventory, Finance, Customer, Supplier, Ledger or Posting semantics.

Core does not require EVO.

## 3. Component Library

Component Library answers:

> What reusable frontend capabilities can an LLM choose instead of generating new UI code?

Examples:

- TextInput;
- NumberInput;
- Select;
- TreeSelect;
- DatePicker;
- Form;
- DataGrid;
- EditableGrid;
- FilterBar;
- Tabs;
- Drawer;
- Dialog;
- Navigation;
- KPI;
- Chart;
- Timeline;
- Tree;
- Dashboard layout;
- visualization primitives.

Core should stay small. The Component Library may become large.

Generic UI primitives belong here, not in business application packages.

## 4. App Host

App Host answers:

> When a browser starts, what loads the installed application experience and gives it a place to run?

App Host is the production application container for Eidos.

Typical startup flow:

```text
Browser
→ App Host bootstrap
→ load application / experience manifest
→ load navigation / routes / home page definition
→ load page definitions
→ Eidos Core
→ Component Library
→ rendered application
```

App Host may own frontend-shell concerns such as:

- bootstrap;
- route host;
- navigation host;
- application manifest loading;
- page loading;
- component registry assembly;
- data adapter registration;
- action adapter registration;
- loading/error shell;
- host-level lifecycle.

App Host does not own the backend database.

A page definition may be stored in EVO, another backend, JSON, a local file, or any other system. App Host only consumes it through declared host contracts.

## 5. Backend Independence

Eidos must work without EVO.

Valid hosts include:

- EVO;
- REST API;
- GraphQL API;
- custom backend;
- mock/local JSON source.

Architectural proof:

```text
replace EVO with Mock Host
→ Eidos Core still works
→ Component Library still works
→ App Host still boots and renders
```

If this is not true, Eidos is not yet a pure frontend framework.

## 6. Installable Business Applications

A business application installed into an enterprise may contain backend capability plus an Eidos experience definition.

Logical model:

```text
Business App Package
├─ backend capability
└─ Eidos experience
   ├─ app manifest
   ├─ routes
   ├─ navigation
   ├─ pages / UIDL
   ├─ dashboards
   └─ data/action bindings
```

Eidos does not own the backend portion.

The frontend portion must use Eidos public contracts and reusable components.

## 7. Example — Finance Reporting

A Finance Reporting package may provide backend APIs/projections itself.

Its frontend may provide:

```text
Finance Reporting Experience
├─ navigation entry
├─ Balance Sheet page
├─ Income Statement page
└─ Cash Flow Statement page
```

These pages should compose generic Eidos components such as:

- TreeGrid;
- DataGrid;
- FilterBar;
- KPI;
- Chart;
- Tabs.

The package should not create another frontend framework.

## 8. Business Page vs Generic Component

Generic capability:

```text
Form
DataGrid
Chart
FilterBar
```

belongs to Eidos.

Business composition:

```text
Sales Order Form
Inventory List
Balance Sheet Page
Production Dashboard
```

belongs to the installed business application/experience package.

Rule:

> Eidos provides the building blocks; the application package provides the composition.

## 9. Action Boundary

Rendering never performs business execution directly.

```text
User interaction
→ Eidos ActionRequest
→ Host Adapter / public backend API
→ authoritative backend execution
→ result
→ Eidos updates experience
```

Business packages must bind actions to declared public backend APIs.

They must not import backend implementation or access backend private databases.

## 10. Data Boundary

Eidos consumes data contracts; it does not own enterprise truth.

```text
Backend
→ public query/data contract
→ Eidos App Host / adapter
→ Eidos Core
→ component
```

Frontend cache/state is non-authoritative unless an explicit host contract states otherwise.

## 11. App Host and Installed Applications

App Host should be capable of discovering effective installed experiences dynamically.

Conceptually:

```text
App Host
→ discover installed applications
→ fetch effective experience manifests
→ merge navigation/routes
→ resolve home page
→ load page definitions
→ render
```

Therefore homepage, navigation and application pages do not need to be compiled permanently into Eidos.

## 12. Examples and Showcase

Examples are separate from the production architecture:

```text
examples/
showcase/
playground/
reference-apps/
```

They prove how Core + Components + App Host compose.

They are not the authoritative storage location for enterprise content.

## 13. LLM-native rule

The desired LLM workflow is:

```text
requirement
→ discover Eidos components
→ select
→ compose declarative page/app definition
→ validate
→ run in App Host
```

Default rule:

> Prefer component selection and declarative composition over generating new frontend implementation.

If an application needs a reusable frontend capability that does not exist, first consider adding a generic capability/component to Eidos rather than hiding one-off framework code inside the business application.

## 14. Cross-project rule with EVO

EVO may publish installable packages that contain an Eidos experience contribution.

Eidos remains backend-independent.

Therefore:

- EVO does not own Eidos Core;
- Eidos does not own EVO business truth;
- business packages may span both sides through public contracts;
- Eidos App Host is the frontend container that activates installed experience contributions.

## 15. Acceptance Tests

Eidos architecture is considered aligned when:

1. Core can run with a Mock Host;
2. App Host can boot from external manifests/page definitions;
3. business pages can be added without modifying Eidos Core;
4. installed experience can add/remove navigation and routes dynamically;
5. generic UI primitives remain in Component Library;
6. business-specific composition remains outside Eidos Core;
7. no business package requires private Eidos implementation imports;
8. no Eidos runtime path requires EVO internals.


## 16. App Host implementation baseline — 2026-09-23

The first implementation now lives under `src/app-host/`.

Its core port is deliberately backend-independent:

```text
ExperienceSource
├─ listEffectiveExperienceManifests()
└─ loadPage(page)
```

App Host:

```text
discover
→ validate
→ deterministically merge
→ expose navigation/routes
→ resolve route
→ lazily load page
```

It consumes **effective active Experience Contributions**. It does not call Package install/activate operations itself.

A future App Manager-backed source and a Mock source must be interchangeable from App Host's perspective.

Ambiguous cross-package route/page/navigation collisions fail closed with diagnostics instead of using load order as hidden precedence.
