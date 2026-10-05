import test from "node:test";
import assert from "node:assert/strict";

import {
  actionResultDownloadV010
} from "../../dist/app-host/index.js";

test("ActionHost download result is normalized for browser delivery", () => {
  assert.deepEqual(
    actionResultDownloadV010({
      message: "Ready",
      download: {
        fileName: "template.evo-template.json",
        mediaType: "application/json",
        content: "{\"ok\":true}"
      }
    }),
    {
      fileName: "template.evo-template.json",
      mediaType: "application/json",
      content: "{\"ok\":true}"
    }
  );
});

test("ActionHost download result is optional", () => {
  assert.equal(actionResultDownloadV010({ message: "Saved" }), undefined);
  assert.equal(actionResultDownloadV010(null), undefined);
});

test("ActionHost download result rejects unsafe file names and malformed payloads", () => {
  assert.throws(
    () => actionResultDownloadV010({
      download: {
        fileName: "../template.json",
        mediaType: "application/json",
        content: "{}"
      }
    }),
    /EIDOS_ACTION_DOWNLOAD_INVALID/
  );
  assert.throws(
    () => actionResultDownloadV010({
      download: {
        fileName: "template.json",
        mediaType: "application/json",
        content: 123
      }
    }),
    /EIDOS_ACTION_DOWNLOAD_INVALID/
  );
});
