import { LeaderCard } from "./LeadeCard";

export function TopThree({ players, isDarkMode, selectedTournament, globalUsers }) {
  if (!players || players.length === 0) return null;

  // Prefer ranks attached to player objects (stable). Fallback to tournament rankList when necessary.
  const getRank = (player, defaultRank) => {
    const isGlobal = !selectedTournament || typeof selectedTournament === 'string';
    if (isGlobal) return player.globalRank ?? defaultRank;
    return player.tournamentRank ?? selectedTournament?.rankList?.[player._id || player.id] ?? defaultRank;
  };

  const getRanks = (player) => {
    const globalRank = player.globalRank ?? null;
    const tournamentRank = player.tournamentRank ?? selectedTournament?.rankList?.[player._id || player.id] ?? null;
    return { globalRank, tournamentRank };
  };

  const tournamentName = selectedTournament?.tournamentName || (typeof selectedTournament === 'string' ? selectedTournament : undefined);

  // Render gracefully for 1,2 or 3 matches so search results are always visible
  if (players.length === 1) {
    const { globalRank, tournamentRank } = getRanks(players[0]);
    return (
      <section className="flex justify-center items-end gap-10 mb-16">
        <LeaderCard player={players[0]} rank={getRank(players[0], 1)} isDarkMode={isDarkMode} globalRank={globalRank} tournamentRank={tournamentRank} tournamentName={tournamentName} selectedTournament={selectedTournament} />
      </section>
    );
  }

  if (players.length === 2) {
    const p1Ranks = getRanks(players[1]);
    const p0Ranks = getRanks(players[0]);
    return (
      <section className="flex flex-col md:flex-row justify-center items-end gap-10 mb-16">
        <LeaderCard player={players[1]} rank={getRank(players[1], 2)} isDarkMode={isDarkMode} globalRank={p1Ranks.globalRank} tournamentRank={p1Ranks.tournamentRank} tournamentName={tournamentName} selectedTournament={selectedTournament} />
        <LeaderCard player={players[0]} rank={getRank(players[0], 1)} isDarkMode={isDarkMode} globalRank={p0Ranks.globalRank} tournamentRank={p0Ranks.tournamentRank} tournamentName={tournamentName} selectedTournament={selectedTournament} />
      </section>
    );
  }

  // 3 or more: show top three with center-first layout
  const p1Ranks = getRanks(players[1]);
  const p0Ranks = getRanks(players[0]);
  const p2Ranks = getRanks(players[2]);
  return (
    <section className="flex flex-col md:flex-row justify-center items-end gap-10 mb-16">
      <LeaderCard player={players[1]} rank={getRank(players[1], 2)} isDarkMode={isDarkMode} globalRank={p1Ranks.globalRank} tournamentRank={p1Ranks.tournamentRank} tournamentName={tournamentName} selectedTournament={selectedTournament} />
      <LeaderCard player={players[0]} rank={getRank(players[0], 1)} isDarkMode={isDarkMode} globalRank={p0Ranks.globalRank} tournamentRank={p0Ranks.tournamentRank} tournamentName={tournamentName} selectedTournament={selectedTournament} />
      <LeaderCard player={players[2]} rank={getRank(players[2], 3)} isDarkMode={isDarkMode} globalRank={p2Ranks.globalRank} tournamentRank={p2Ranks.tournamentRank} tournamentName={tournamentName} selectedTournament={selectedTournament} />
    </section>
  );
}
