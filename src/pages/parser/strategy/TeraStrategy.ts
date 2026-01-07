import { ILogLineStrategy } from "./LogLineStrategy.interface";
import { BattleGame } from "../../models/BattleGame.interface";

export class TeraStrategy implements ILogLineStrategy {
  parse(parts: string[], game: BattleGame): void {
    // |-terastallize|p2b: Landorus|Steel
    const idAndNick = parts[2];
    const type = parts[3];
    const [side, nickname] = idAndNick.split(":").map((s) => s.trim());
    const playerId = side.substring(0, 2);

    const noteTeam = playerId === "p1" ? game.notes.p1Team : game.notes.p2Team;

    // Find the mon in the chosen team and mark it
    const mon = noteTeam.find((p) => p.name === nickname);
    if (mon) {
      mon.isTera = true;
      mon.teraType = type;

      if (playerId === "p1") game.notes.p1Tera = mon;
      else game.notes.p2Tera = mon;
    }
  }
}
