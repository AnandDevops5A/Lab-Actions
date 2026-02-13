import { NextResponse } from 'next/server';

// Mock tournament match metadata endpoint.
// Replace this with your real backend endpoint or database lookup.

export async function GET(request, { params }) {
  const { id } = params || {};
  // For demo return static data; you can integrate with your DB.
  const sample = {
    tournamentId: id || 'unknown',
    matchMeta: {
      teamA: 'Red Legion',
      teamB: 'Blue Wolves',
      scoreA: Math.floor(Math.random() * 5),
      scoreB: Math.floor(Math.random() * 5),
      round: 'Quarterfinals',
      status: 'live',
    },
  };

  return NextResponse.json({ ok: true, data: sample });
}
