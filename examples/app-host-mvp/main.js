import {
  createAppHost,
  createAppManagerExperienceSource,
  mountBrowserAppHostShell
} from "../../dist/app-host/index.js";

const params = new URLSearchParams(window.location.search);
const managerUrl = params.get("manager") ?? "http://localhost:4100";
const status = document.querySelector("#harness-status");
const installButton = document.querySelector("#install-company-notes");
const refreshButton = document.querySelector("#refresh-host");

function setStatus(value) {
  status.textContent = value;
}

async function postJson(path, body) {
  const response = await fetch(`${managerUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}

const source = createAppManagerExperienceSource({ baseUrl: managerUrl });
const host = createAppHost(source);
const shell = await mountBrowserAppHostShell({
  host,
  container: "#app",
  title: "Eidos"
});

installButton.addEventListener("click", async () => {
  installButton.disabled = true;
  try {
    setStatus("Planning installation...");
    const plan = await postJson("/v1/install/plan", { packageId: "company-notes" });

    if (plan.blockers?.length) {
      setStatus(`Blocked: ${JSON.stringify(plan.blockers)}`);
      return;
    }

    setStatus(
      `Plan: install [${plan.installPackages.join(", ")}], activate [${plan.activateFeatures.join(", ")}]`
    );

    await postJson("/v1/install", { packageId: "company-notes" });
    const snapshot = await shell.refresh();

    setStatus(
      `Installed. App Host revision ${snapshot.revision}; active navigation: ${snapshot.navigation
        .map(item => item.label)
        .join(", ")}`
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error));
  } finally {
    installButton.disabled = false;
  }
});

refreshButton.addEventListener("click", async () => {
  try {
    const snapshot = await shell.refresh();
    setStatus(
      `Refreshed revision ${snapshot.revision}; ${snapshot.navigation.length} navigation item(s)`
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error));
  }
});

setStatus(`Connected to App Manager: ${managerUrl}`);
