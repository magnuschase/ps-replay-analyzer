import { createRoot } from "react-dom/client";
import "./style.css";
// @crxjs/vite-plugin forces vite to build ?script files as standalone scripts
// import will resolve to something like "/assets/injected.28c29.js"
import injectedScript from "./injected?script";

const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);
root.render(
  <div className="absolute bottom-0 left-0 text-lg text-black bg-amber-400 z-50">
    content script <span className="your-class">loaded</span>
  </div>
);

try {
  console.log("[PS Replay Analyzer] content script loaded");

  // Inject the script
  const script = document.createElement("script");
  script.src = injectedScript;
  script.onload = function () {
    console.log("[PS Replay Analyzer] injected.js loaded");
  };
  (document.head || document.documentElement).appendChild(script);

  // Listen for messages from injected script
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data.type && event.data.type === "SHOWDOWN_ANALYZER_LOG") {
      console.log(
        "[PS Replay Analyzer] Received log from page, sending to background"
      );
      chrome.runtime.sendMessage({
        type: "SAVE_BATTLE",
        payload: event.data.payload,
      });
    }
  });
} catch (e) {
  console.error(e);
}
