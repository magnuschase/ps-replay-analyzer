import "./style.css";
// @crxjs/vite-plugin forces vite to build ?script files as standalone scripts
// import will resolve to something like "/assets/injected.28c29.js"
import injectedScript from "./injected?script";

try {
  console.log("[PS Replay Analyzer] content script loaded");
  const url = chrome.runtime.getURL(injectedScript);
  console.log("[PS Replay Analyzer] resolved URL:", url);

  // Inject the script
  const script = document.createElement("script");
  script.src = url;
  script.type = "module";
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
