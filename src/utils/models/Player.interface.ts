import { Pokemon } from "./Pokemon.interface";

export interface Player {
  id: string; // p1 or p2
  name: string;
  team: Pokemon[]; // From team preview
}
