import { ILogLineStrategy } from "./LogLineStrategy.interface";
import { BattleGame } from "../../models/BattleGame.interface";

export class PlayerStrategy implements ILogLineStrategy {
  parse(parts: string[], game: BattleGame): void {
    // |player|p1|magnuschase2115|101|1130
    const playerId = parts[2];
    const name = parts[3];
    if (playerId === "p1") {
      game.p1.name = name;
    } else if (playerId === "p2") {
      game.p2.name = name;
    }
  }
}
