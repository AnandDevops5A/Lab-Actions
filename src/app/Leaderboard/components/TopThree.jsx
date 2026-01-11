import { LeaderCard } from "./LeadeCard";

export function TopThree({ players, isDarkMode }) {
  if (!players || players.length === 0) return null;

  // Render gracefully for 1,2 or 3 matches so search results are always visible
  if (players.length === 1) {
    return (
      <section className="flex justify-center items-end gap-10 mb-16">
        <LeaderCard player={players[0]} position={1} isDarkMode={isDarkMode} />
      </section>
    );
  }

  if (players.length === 2) {
    return (
      <section className="flex flex-col md:flex-row justify-center items-end gap-10 mb-16">
        <LeaderCard player={players[1]} position={2} isDarkMode={isDarkMode} />
        <LeaderCard player={players[0]} position={1} isDarkMode={isDarkMode} />
      </section>
    );
  }

  // 3 or more: show top three with center-first layout
  return (
    <section className="flex flex-col md:flex-row justify-center items-end gap-10 mb-16">
      <LeaderCard player={players[1]} position={2} isDarkMode={isDarkMode} />
      <LeaderCard player={players[0]} position={1} isDarkMode={isDarkMode} />
      <LeaderCard player={players[2]} position={3} isDarkMode={isDarkMode} />
    </section>
  );
}