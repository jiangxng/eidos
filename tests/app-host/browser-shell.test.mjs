import test from "node:test";
import assert from "node:assert/strict";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

test("default App Host page renderer renders UIDL through Eidos renderer", () => {
  const html = renderAppHostPageToHtml({
    experienceId: "company-notes",
    packageId: "company-notes",
    featureId: "company-notes.default",
    route: { id: "company-notes.home", path: "/notes", pageId: "company-notes.home" },
    page: { id: "company-notes.home", source: "app://company-notes/pages/home" },
    definition: {
      contractVersion: "0.1.1",
      kind: "form",
      id: "company-notes.home",
      title: "Company Notes",
      purpose: "execute-command",
      command: { code: "company-notes.save-note", inputVersion: "0.1.0" },
      fields: [
        {
          key: "title",
          label: "Title",
          semanticType: "note-title",
          control: "text",
          required: true
        }
      ],
      actions: [
        {
          id: "save",
          label: "Save Note",
          type: "submit",
          command: "company-notes.save-note",
          requiresConfirmation: false
        }
      ]
    }
  });

  assert.match(html, /Company Notes/);
  assert.match(html, /company-notes\.save-note/);
  assert.match(html, /data-eidos-action="save"/);
});
