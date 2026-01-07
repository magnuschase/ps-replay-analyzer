import { LogParser } from "../../utils/parser/LogParser";
import { IndexedDBBattleRepository } from "../../utils/repository/IndexedDBBattleRepository";

console.log("[PS Replay Analyzer] Background script initialized");

const repository = new IndexedDBBattleRepository();
const parser = new LogParser();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_BATTLE") {
    const { id, logData } = message.payload;

    console.log("Received battle log for:", id);

    try {
      const battle = parser.parse(logData, id);
      repository
        .saveBattle(battle)
        .then(() => {
          console.log("Battle saved:", id);
          sendResponse({ success: true });
        })
        .catch((err) => {
          console.error("Error saving battle:", err);
          sendResponse({ success: false, error: err.message });
        });

      return true; // Keep channel open for async response
    } catch (e: any) {
      console.error("Error parsing battle:", e);
      sendResponse({ success: false, error: e.message });
    }
  }
});
