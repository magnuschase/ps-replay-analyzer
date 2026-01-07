import { ILogLineStrategy } from "./LogLineStrategy.interface";
import { BattleGame } from "../../models/BattleGame.interface";

export class WinStrategy implements ILogLineStrategy {
  parse(parts: string[], game: BattleGame): void {
    // |win|itadorixmegumibl
    game.winner = parts[2];
    game.notes.winner = parts[2];
  }
}
