import { BattleGame } from "../../models/BattleGame.interface";

export interface ILogLineStrategy {
  parse(lineParts: string[], game: BattleGame): void;
}
