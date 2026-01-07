import { useEffect, useState, useMemo } from "react";
import { PopupController } from "./PopupController";
import { BattleGame } from "@src/utils/models/BattleGame.interface";

export function usePopupController() {
  const controller = useMemo(() => new PopupController(), []);
  const [battles, setBattles] = useState<BattleGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBattles();
  }, []);

  const loadBattles = async () => {
    try {
      setLoading(true);
      const data = await controller.getAllBattles();
      setBattles(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load battles");
    } finally {
      setLoading(false);
    }
  };

  const groupedBattles = useMemo(() => {
    const groups = controller.groupBattles(battles);
    // Sort groups by most recent battle in them
    return Array.from(groups.values()).sort((a, b) => {
      const timeA = Math.max(...a.map((g) => g.timestamp));
      const timeB = Math.max(...b.map((g) => g.timestamp));
      return timeB - timeA;
    });
  }, [battles, controller]);

  return {
    loading,
    error,
    groupedBattles,
    downloadReplay: (game: BattleGame) => controller.downloadReplay(game),
    formatTeam: (team: any) => controller.formatTeam(team),
    formatTera: (mon: any) => controller.formatTera(mon),
    refresh: loadBattles,
  };
}
