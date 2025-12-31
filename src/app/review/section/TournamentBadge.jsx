export function TournamentBadge({ id }) {
    const t = tournaments.find((x) => x.id === id);
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-300">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        {t?.name ?? 'Unknown'}
      </span>
    );
  }