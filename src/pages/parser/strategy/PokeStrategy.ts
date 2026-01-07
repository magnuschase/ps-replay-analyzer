import { ILogLineStrategy } from "./LogLineStrategy.interface";
import { BattleGame } from "../../models/BattleGame.interface";
import { Pokemon } from "../../models/Pokemon.interface";

export class PokeStrategy implements ILogLineStrategy {
  parse(parts: string[], game: BattleGame): void {
    // |poke|p1|Tornadus, L50, M|
    const playerId = parts[2];
    const details = parts[3];
    const species = details.split(",")[0].trim();

    const pokemon: Pokemon = {
      name: species, // Default name to species until we see nickname (though |poke| doesn't give nickname, |switch| does)
      species: species,
      details: details,
      teraType: null,
      isTera: false,
      hp: "100/100",
    };

    if (playerId === "p1") {
      game.p1.team.push(pokemon);
    } else if (playerId === "p2") {
      game.p2.team.push(pokemon);
    }
  }
}
