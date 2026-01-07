import { IndexedDBBattleRepository } from "@src/utils/repository/IndexedDBBattleRepository";
import { BattleGame } from "@src/utils/models/BattleGame.interface";
import { Pokemon } from "@src/utils/models/Pokemon.interface";

export class PopupController {
  private repository: IndexedDBBattleRepository;

  constructor() {
    this.repository = new IndexedDBBattleRepository();
  }

  async getAllBattles(): Promise<BattleGame[]> {
    return await this.repository.getAllBattles();
  }

  groupBattles(battles: BattleGame[]): Map<string, BattleGame[]> {
    const groups = new Map<string, BattleGame[]>();

    for (const battle of battles) {
      // If seriesId is null, use battle.id as unique group
      const key = battle.seriesId || `single_${battle.id}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)?.push(battle);
    }
    return groups;
  }

  formatTeam(team: Pokemon[]): string {
    if (!team.length) return "Unknown";
    return team
      .map((p) =>
        p.name === p.species ? p.species : `${p.name} (${p.species})`
      )
      .join(" | ");
  }

  formatTera(mon: Pokemon | null): string {
    if (!mon) return "DID NOT TERA";
    return `💎 ${mon.name} (${mon.teraType})`;
  }

  downloadReplay(game: BattleGame) {
    const css = `html,body {font-family:Verdana, sans-serif;font-size:10pt;margin:0;padding:0;}body{padding:12px 0;} .battle-log {font-family:Verdana, sans-serif;font-size:10pt;} .battle-log-inline {border:1px solid #AAAAAA;background:#EEF2F5;color:black;max-width:640px;margin:0 auto 80px;padding-bottom:5px;} .battle-log .inner {padding:4px 8px 0px 8px;} .battle-log .inner-preempt {padding:0 8px 4px 8px;} .battle-log .inner-after {margin-top:0.5em;} .battle-log h2 {margin:0.5em -8px;padding:4px 8px;border:1px solid #AAAAAA;background:#E0E7EA;border-left:0;border-right:0;font-family:Verdana, sans-serif;font-size:13pt;} .battle-log .chat {vertical-align:middle;padding:3px 0 3px 0;font-size:8pt;} .battle-log .chat strong {color:#40576A;} .battle-log .chat em {padding:1px 4px 1px 3px;color:#000000;font-style:normal;} .chat.mine {background:rgba(0,0,0,0.05);margin-left:-8px;margin-right:-8px;padding-left:8px;padding-right:8px;} .spoiler {color:#BBBBBB;background:#BBBBBB;padding:0px 3px;} .spoiler:hover, .spoiler:active, .spoiler-shown {color:#000000;background:#E2E2E2;padding:0px 3px;} .spoiler a {color:#BBBBBB;} .spoiler:hover a, .spoiler:active a, .spoiler-shown a {color:#2288CC;} .chat code, .chat .spoiler:hover code, .chat .spoiler:active code, .chat .spoiler-shown code {border:1px solid #C0C0C0;background:#EEEEEE;color:black;padding:0 2px;} .chat .spoiler code {border:1px solid #CCCCCC;background:#CCCCCC;color:#CCCCCC;} .battle-log .rated {padding:3px 4px;} .battle-log .rated strong {color:white;background:#89A;padding:1px 4px;border-radius:4px;} .spacer {margin-top:0.5em;} .message-announce {background:#6688AA;color:white;padding:1px 4px 2px;} .message-announce a, .broadcast-green a, .broadcast-blue a, .broadcast-red a {color:#DDEEFF;} .broadcast-green {background-color:#559955;color:white;padding:2px 4px;} .broadcast-blue {background-color:#6688AA;color:white;padding:2px 4px;} .infobox {border:1px solid #6688AA;padding:2px 4px;} .infobox-limited {max-height:200px;overflow:auto;}
        
        /* Analyzer Notes Styles */
        .analyzer-notes {
            margin: 20px auto;
            max-width: 1180px;
            padding: 15px;
            background: #0a0a0a;
            border: 1px solid #0f0f0f;
            border-radius: 8px;
            font-family: Verdana, sans-serif;
						color: #fafafa;
        }
        .analyzer-notes h3 {
            margin-top: 0;
            color: #ffffff;
            border-bottom: 2px solid oklch(26.2% 0.051 172.552);
            padding-bottom: 5px;
        }
        .note-section {
            margin-bottom: 10px;
        }
        .note-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            width: 150px;
        }
        `;

    const notesHtml = `
            <div class="analyzer-notes">
                <h3>Battle Analysis (Showdown Analyzer)</h3>
                <div class="note-section">
                    <span class="note-label">Winner:</span>
                    <strong style="color: ${game.winner ? "green" : "black"}">${
      game.winner || "Unknown"
    }</strong>
                </div>
                <div class="note-section">
                    <div class="note-label">${game.p1.name}'s Team:</div>
                    <div>${this.formatTeam(game.notes.p1Team)}</div>
                </div>
                <div class="note-section">
                    <div class="note-label">${game.p2.name}'s Team:</div>
                    <div>${this.formatTeam(game.notes.p2Team)}</div>
                </div>
                <div class="note-section">
                    <div class="note-label">Tera Usage:</div>
                    <div><strong>${game.p1.name}:</strong> ${this.formatTera(
      game.notes.p1Tera
    )}</div>
                    <div><strong>${game.p2.name}:</strong> ${this.formatTera(
      game.notes.p2Tera
    )}</div>
                </div>
            </div>
        `;

    const html = `<!DOCTYPE html>
<meta charset="utf-8" />
<title>${game.id}</title>
<style>${css}</style>
<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">
<input type="hidden" name="replayid" value="${game.id}" />
<h1 style="font-weight:normal;text-align:center"><strong>${game.id}</strong><br />${game.p1.name} vs. ${game.p2.name}</h1>
<script type="text/plain" class="battle-log-data">${game.logRaw}</script>
<div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>
${notesHtml}
</div>
<script>
let daily = Math.floor(Date.now()/1000/60/60/24);document.write('<script src="https://play.pokemonshowdown.com/js/replay-embed.js?version'+daily+'"></'+'script>');
</script>
`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${game.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
