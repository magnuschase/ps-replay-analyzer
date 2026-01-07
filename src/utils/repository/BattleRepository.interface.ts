import { BattleGame } from "../models/BattleGame.interface";

export interface IBattleRepository {
  saveBattle(battle: BattleGame): Promise<void>;
  getSeries(seriesId: string): Promise<BattleGame[]>;
  getAllBattles(): Promise<BattleGame[]>;
  getBattle(id: string): Promise<BattleGame | undefined>;
}
