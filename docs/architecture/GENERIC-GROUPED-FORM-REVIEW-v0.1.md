# Eidos Generic Grouped Form Review v0.1

**Owner:** Eidos deterministic Human Experience framework. **Classification:** public UIDL Form presentation/interaction extension, not enterprise data or product import workflow.

A normal form can now describe `reviewGroups`. Each group has a Human-facing title/summary, one always-visible primary input and zero or more detailed inputs inside a native HTML `details` disclosure. The ordinary submit/validation model, source input keys, unique selection and Host action request remain unchanged. Fields not in a group stay in the ordinary form.

```json
{
  "reviewGroups": [
    {
      "id": "row-one",
      "title": "First item",
      "summary": "Review the item in context",
      "primaryFieldKey": "decision_0",
      "detailFieldKeys": ["label_0","type_0","evidence_0"],
      "detailsLabel": "Review supporting details",
      "defaultExpanded": false
    }
  ]
}
```

**Boundary:** Eidos never knows a source column, enterprise field, record identity, approval policy, AI mapping, permission or storage. The consuming application's Experience projects its existing authorized facts and declares which field is the primary decision; the Host still validates and executes every command. A group must refer only to existing fields, with unique IDs and no repeated field membership. Invalid references fail UIDL validation.

**Human acceptance:** desktop groups compress review scanning to one group/line, a direct primary choice and optional supporting detail; mobile uses a single-column native disclosure with keyboard/focus support. Progressive disclosure does not remove inputs from the form or change submission. Text is HTML escaped; no custom application CSS. Visual/manual and downstream Host integration acceptance are distinct from Eidos contract testing.

**Status:** candidate until latest Eidos CI passes and merged; consumers should use pinned public Eidos capability rather than copy renderer code into application modules.
