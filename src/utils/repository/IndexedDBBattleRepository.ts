import { IBattleRepository } from "./BattleRepository.interface";
import { BattleGame } from "../models/BattleGame.interface";

export class IndexedDBBattleRepository implements IBattleRepository {
  private dbName = "ShowdownReplayAnalyzerDB";
  private version = 1;
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("battles")) {
          const store = db.createObjectStore("battles", { keyPath: "id" });
          store.createIndex("seriesId", "seriesId", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async saveBattle(battle: BattleGame): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["battles"], "readwrite");
      const store = transaction.objectStore("battles");
      // Check if exists first to avoid overwriting if not needed, or just put (upsert)
      const request = store.put(battle);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getSeries(seriesId: string): Promise<BattleGame[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["battles"], "readonly");
      const store = transaction.objectStore("battles");
      const index = store.index("seriesId");
      const request = index.getAll(seriesId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAllBattles(): Promise<BattleGame[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["battles"], "readonly");
      const store = transaction.objectStore("battles");
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Sort by timestamp desc
        const battles = request.result as BattleGame[];
        battles.sort((a, b) => b.timestamp - a.timestamp);
        resolve(battles);
      };
    });
  }

  async getBattle(id: string): Promise<BattleGame | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["battles"], "readonly");
      const store = transaction.objectStore("battles");
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}
