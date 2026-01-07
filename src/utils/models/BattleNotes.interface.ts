import { Pokemon } from "./Pokemon.interface";

export interface BattleNotes {
  p1Team: Pokemon[]; // The 4 chosen mons
  p2Team: Pokemon[];
  p1Tera: Pokemon | null;
  p2Tera: Pokemon | null;
  winner: string; // Player name
}
