import { ILogLineStrategy } from "./LogLineStrategy.interface";
import { BattleGame } from "../../models/BattleGame.interface";

export class SeriesStrategy implements ILogLineStrategy {
  parse(parts: string[], game: BattleGame): void {
    // |uhtml|bestof|... <a href="/game-bestof3-gen9vgc2026regfbo3-2513338044"> ...
    // We need to extract the ID.
    const html = parts[3];
    const match = html.match(/game-bestof3-[a-zA-Z0-9-]+/);
    if (match) {
      game.seriesId = match[0];
    }
  }
}
