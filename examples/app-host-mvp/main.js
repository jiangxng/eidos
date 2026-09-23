import {
  createAppHost,
  createAppManagerExperienceSource,
  mountBrowserAppHostShell
} from "../../dist/app-host/index.js";

const params = new URLSearchParams(window.location.search);
const managerUrl = params.get("manager") ?? "http://localhost:4100";
const agentUrl = params.get("agent") ?? "http://localhost:4300";

const log = document.querySelector("#agent-log");
const input = document.querySelector("#agent-input");
const sendButton = document.querySelector("#agent-send");
const refreshButton = document.querySelector("#refresh-host");

function setLog(value) {
  log.textContent = value;
}

async function postJson(baseUrl, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json"
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

async function sendToAgent() {
  const message = input.value.trim();
  if (!message) return;

  sendButton.disabled = true;
  input.disabled = true;
  try {
    setLog(`用户：${message}\n\nEnterprise Agent：处理中…`);

    const reply = await postJson(agentUrl, "/v1/chat", { message });
    const trace = (reply.observations ?? [])
      .map(item => `${item.ok ? "✓" : "✗"} ${item.tool}`)
      .join("\n");

    const installed = (reply.observations ?? []).some(
      item => item.tool === "app.install.execute" && item.ok
    );

    let refreshMessage = "";
    if (installed) {
      const snapshot = await shell.refresh();
      refreshMessage = `\n\nApp Host 已刷新：revision ${snapshot.revision}；导航：${snapshot.navigation
        .map(item => item.label)
        .join("、") || "无"}`;
    }

    setLog(
      `用户：${message}\n\nEnterprise Agent：${reply.message}` +
      (trace ? `\n\n工具轨迹：\n${trace}` : "") +
      refreshMessage
    );
  } catch (error) {
    setLog(`请求失败：${error instanceof Error ? error.message : String(error)}`);
  } finally {
    sendButton.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

sendButton.addEventListener("click", () => {
  void sendToAgent();
});

input.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    void sendToAgent();
  }
});

refreshButton.addEventListener("click", async () => {
  try {
    const snapshot = await shell.refresh();
    setLog(
      `App Host 已刷新：revision ${snapshot.revision}；${snapshot.navigation.length} 个导航项。`
    );
  } catch (error) {
    setLog(`刷新失败：${error instanceof Error ? error.message : String(error)}`);
  }
});

setLog(
  `已连接。App Manager: ${managerUrl}\nEnterprise Agent: ${agentUrl}\n\n试试：“帮我安装 Company Notes”`
);
