export interface Pokemon {
  name: string; // Nickname
  species: string; // Actual species
  details: string; // Gender, Level, etc.
  teraType: string | null;
  isTera: boolean;
  hp: string; // "100/100" or "0 fnt"
}
