import React, { useState } from "react";
import { usePopupController } from "./usePopupController";
import { BattleGame } from "@src/utils/models/BattleGame.interface";

export default function Popup() {
  const {
    loading,
    error,
    groupedBattles,
    downloadReplay,
    formatTeam,
    formatTera,
  } = usePopupController();

  if (loading) {
    return <div className="p-4 text-center">Loading battles...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-w-[600px] max-w-[800px] min-h-[600px] bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-mono">
      <header className="bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-700 p-4 mb-4 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">
          Replay Analyzer
        </h1>
      </header>
      <main className="p-4">
        {groupedBattles.length === 0 ? (
          <div className="text-center text-gray-500">
            No battles recorded yet.
          </div>
        ) : (
          <table className="w-full bg-neutral-50 dark:bg-neutral-900 shadow-sm rounded-md overflow-hidden">
            <thead className="bg-teal-50 dark:bg-teal-800 text-left">
              <tr>
                <th className="p-3 font-semibold border-b border-neutral-700">
                  Date
                </th>
                <th className="p-3 font-semibold border-b border-neutral-700">
                  Matchup
                </th>
                <th className="p-3 font-semibold border-b border-neutral-700">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedBattles.map((group, index) => (
                <BattleGroupRow
                  key={index}
                  group={group}
                  downloadReplay={downloadReplay}
                  formatTeam={formatTeam}
                  formatTera={formatTera}
                />
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

function BattleGroupRow({
  group,
  downloadReplay,
  formatTeam,
  formatTera,
}: {
  group: BattleGame[];
  downloadReplay: (g: BattleGame) => void;
  formatTeam: (t: any) => string;
  formatTera: (t: any) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  // Sort logic for group representative (assuming logic from original controller: latest first?)
  // Actually controller grouped them. Let's take the first one (most recent usually if added in order, or we can sort)
  // The hook sorts groups, but inside the group? Let's treat group[0] as representative or the last one played.
  // The timestamp is what matters.
  const sortedGroup = [...group].sort((a, b) => b.timestamp - a.timestamp);
  const latestGame = sortedGroup[0];

  // Determine series winner
  const p1Wins = group.filter((g) => g.winner === latestGame.p1.name).length;
  const p2Wins = group.filter((g) => g.winner === latestGame.p2.name).length;
  const seriesWinner =
    p1Wins > p2Wins ? latestGame.p1.name : latestGame.p2.name;
  const isTie = p1Wins === p2Wins;

  const dateStr = new Date(latestGame.timestamp).toLocaleString("pl-PL");
  const matchupText = `${latestGame.p1.name} vs ${latestGame.p2.name}`;

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="hover:bg-teal-200 dark:hover:bg-neutral-500 cursor-pointer max-w-full"
      >
        <td className="p-3">{dateStr}</td>
        <td className="p-3">
          {matchupText}
          {group.length > 1 && (
            <span className="ml-2 text-xs font-semibold bg-teal-500 text-teal-50 px-2 py-0.5 rounded">
              Bo3
            </span>
          )}
        </td>
        <td className="p-3 font-medium text-green-600">
          {isTie ? "Tie" : seriesWinner}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-neutral-200 dark:bg-neutral-700 w-full">
          <td colSpan={3} className="p-4 border-b border-neutral-700">
            <div className="space-y-6">
              {sortedGroup.map((game, idx) => (
                <div
                  key={game.id}
                  className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-700"
                >
                  <h3 className="text-lg font-bold mb-3 border-b border-neutral-700 pb-2">
                    Game {sortedGroup.length - idx}
                    {game.winner && (
                      <span className="text-sm font-normal text-gray-500 pl-2">
                        - Won by {game.winner}
                      </span>
                    )}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-700 dark:text-neutral-200">
                        P1 Team ({game.p1.name}):
                      </span>
                      <span className="pl-2 font-mono text-sm bg-teal-800 text-teal-50 px-1 py-0.5 rounded break-all">
                        {formatTeam(game.notes.p1Team)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-700 dark:text-neutral-200">
                        P2 Team ({game.p2.name}):
                      </span>
                      <span className="pl-2 font-mono text-sm bg-teal-800 text-teal-50 px-1 py-0.5 rounded break-all">
                        {formatTeam(game.notes.p2Team)}
                      </span>
                    </div>
                    <div className="bg-teal-200 dark:bg-teal-950 p-2 rounded border border-teal-500 mt-2">
                      <strong className="block text-amber-800 text-sm mb-1">
                        Tera Usage:
                      </strong>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-600">
                            P1:
                          </span>{" "}
                          {formatTera(game.notes.p1Tera)}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">
                            P2:
                          </span>{" "}
                          {formatTera(game.notes.p2Tera)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => downloadReplay(game)}
                      className="px-3 py-1.5 bg-green-600 cursor-pointer text-white text-sm font-medium rounded hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Download Replay File
                    </button>
                    <a
                      href={`https://replay.pokemonshowdown.com/${game.id.replace(
                        "battle-",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-cyan-600 text-white text-sm font-medium rounded hover:bg-cyan-700 transition-colors shadow-sm inline-block"
                    >
                      Watch Online
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
