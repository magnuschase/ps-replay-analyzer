import { ILogLineStrategy } from "./LogLineStrategy.interface";
import { BattleGame } from "../../models/BattleGame.interface";
import { Pokemon } from "../../models/Pokemon.interface";

export class SwitchStrategy implements ILogLineStrategy {
  parse(parts: string[], game: BattleGame): void {
    // |switch|p1a: Tornadus|Tornadus, L50, M|100/100
    const idAndNick = parts[2]; // p1a: Tornadus
    const details = parts[3]; // Tornadus, L50, M
    const hp = parts[4];

    const [side, nickname] = idAndNick.split(":").map((s) => s.trim());
    const playerId = side.substring(0, 2); // p1 or p2
    const species = details.split(",")[0].trim();

    const player = playerId === "p1" ? game.p1 : game.p2;
    const noteTeam = playerId === "p1" ? game.notes.p1Team : game.notes.p2Team;

    // Check if this pokemon is already in the "chosen" list (notes)
    // If not, add it. The instructions say: "4 pokemon that the user chose... in the order that they appeared"

    // We identify pokemon by nickname if possible, or species.
    // In team preview (|poke|), we only get species.
    // In |switch|, we get nickname and species.

    // Find if this mon is already recorded as "seen/chosen"
    const alreadySeen = noteTeam.find(
      (p) =>
        p.name === nickname || (p.name === p.species && p.species === species)
    );

    if (!alreadySeen) {
      // It's a new appearance. Add to the chosen team.
      // We need to map it back to the roster from |poke| to get full details if needed,
      // but |switch| gives us enough for the display usually.
      // Let's create a record for it.
      const newMon: Pokemon = {
        name: nickname,
        species: species,
        details: details,
        hp: hp,
        teraType: null,
        isTera: false,
      };
      noteTeam.push(newMon);
    }
  }
}
