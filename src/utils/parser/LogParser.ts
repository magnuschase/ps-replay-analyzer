import {
  ILogLineStrategy,
  PlayerStrategy,
  PokeStrategy,
  SwitchStrategy,
  TeraStrategy,
  WinStrategy,
  SeriesStrategy,
} from "./strategy";
import { BattleGame } from "../models/BattleGame.interface";

export class LogParser {
  private strategies: Map<string, ILogLineStrategy>;

  constructor() {
    this.strategies = new Map();
    this.registerStrategy("player", new PlayerStrategy());
    this.registerStrategy("poke", new PokeStrategy());
    this.registerStrategy("switch", new SwitchStrategy());
    this.registerStrategy("-terastallize", new TeraStrategy());
    this.registerStrategy("win", new WinStrategy());
    this.registerStrategy("uhtml", new SeriesStrategy()); // For Bo3 detection
  }

  public registerStrategy(key: string, strategy: ILogLineStrategy) {
    this.strategies.set(key, strategy);
  }

  public parse(logData: string, battleId: string = ""): BattleGame {
    const game = new BattleGame(battleId, logData);
    const lines = logData.split("\n");

    for (const line of lines) {
      if (!line.startsWith("|")) continue;

      const parts = line.split("|");
      const key = parts[1]; // |key|...

      const strategy = this.strategies.get(key);
      if (strategy) {
        strategy.parse(parts, game);
      }
    }

    return game;
  }
}
