import { BattleNotes } from "./BattleNotes.interface";
import { Player } from "./Player.interface";

export class BattleGame {
  id: string;
  seriesId: string | null;
  p1: Player;
  p2: Player;
  winner: string | null;
  timestamp: number;
  logRaw: string;
  notes: BattleNotes;
  turnCount: number;

  constructor(id: string, logRaw: string) {
    this.id = id;
    this.logRaw = logRaw;
    this.seriesId = null;
    this.timestamp = Date.now();
    this.winner = null;
    this.turnCount = 0;
    this.p1 = { id: "p1", name: "", team: [] };
    this.p2 = { id: "p2", name: "", team: [] };
    this.notes = {
      p1Team: [],
      p2Team: [],
      p1Tera: null,
      p2Tera: null,
      winner: "",
    };
  }
}
