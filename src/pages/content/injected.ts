console.log("[PS Replay Analyzer] Injected script running in main world!");

function getApp(): any {
  return (window as any).app;
}

function getBattleLog(): any {
  return (window as any).BattleLog;
}

async function processBattle() {
  console.log("[PS Replay Analyzer] Processing battle...");

  try {
    const app = getApp();
    const BattleLog = getBattleLog();

    if (!app) {
      console.error("[PS Replay Analyzer] app is missing");
      return;
    }

    // Find the battle room
    // app.room might be the lobby if the user switched tabs?
    // Let's look through app.rooms for a battle room that has a battle object.
    let room = app.room;

    if (!room || !room.battle) {
      console.log(
        "[PS Replay Analyzer] app.room is not the battle room. Searching app.rooms..."
      );
      if (app.rooms) {
        const roomKeys = Object.keys(app.rooms);
        // Filter for battle rooms
        const battleRooms = roomKeys.filter(
          (k) => k.startsWith("battle-") && app.rooms[k].battle
        );

        if (battleRooms.length > 0) {
          // Pick the most recent one? or the one that just ended?
          // For now, pick the last one or the one matching current URL
          const currentId = window.location.pathname.substring(1);
          const match = battleRooms.find((k) => k === currentId);
          if (match) {
            room = app.rooms[match];
            console.log(`[PS Replay Analyzer] Found matching room: ${match}`);
          } else {
            // Fallback to the first found battle room
            room = app.rooms[battleRooms[battleRooms.length - 1]];
            console.log(`[PS Replay Analyzer] Using fallback room: ${room.id}`);
          }
        }
      }
    }

    if (!room || !room.battle) {
      console.error(
        "[PS Replay Analyzer] Could not find any active battle room in app.rooms"
      );
      return;
    }

    if (!BattleLog) {
      console.error("[PS Replay Analyzer] window.BattleLog is missing");
      return;
    }

    console.log(
      "[PS Replay Analyzer] Generating replay URL for room:",
      room.id
    );
    const url = BattleLog.createReplayFileHref(room);
    console.log("[PS Replay Analyzer] Generated Blob URL:", url);

    if (!url) {
      console.error("[PS Replay Analyzer] Failed to generate replay URL");
      return;
    }

    // Fetch the content of the blob
    const response = await fetch(url);
    const htmlContent = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const logScript = doc.querySelector("script.battle-log-data");

    if (logScript && logScript.textContent) {
      console.log("[PS Replay Analyzer] Log data extracted!");

      window.postMessage(
        {
          type: "SHOWDOWN_ANALYZER_LOG",
          payload: {
            id: room.id,
            logData: logScript.textContent,
          },
        },
        "*"
      );
    } else {
      console.error(
        "[PS Replay Analyzer] Could not find battle-log-data in generated HTML"
      );
    }
  } catch (e) {
    console.error("[PS Replay Analyzer] Error processing battle:", e);
  }
}

let downloadButtonFound = false;

function checkButton() {
  const downloadBtn = document.querySelector(".replayDownloadButton");

  // Check if app is ready before proceeding
  const app = getApp();

  if (downloadBtn && !downloadButtonFound) {
    if (app) {
      downloadButtonFound = true;
      console.log(
        "[PS Replay Analyzer] Download button found! Starting extraction..."
      );
      processBattle();
    } else {
      console.log("[PS Replay Analyzer] Button found but app not ready...");
    }
  } else if (!downloadBtn) {
    downloadButtonFound = false;
  }
}

const observer = new MutationObserver(() => {
  checkButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial check loop
function initLoop() {
  checkButton();
  setTimeout(initLoop, 1000);
}
initLoop();
