"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import CyberLoading from "../skeleton/CyberLoading";
// import LiveTournament from "@/components/live/LiveTournament";

const LiveTournament = dynamic(() => import("@/components/live/LiveTournament"), {
  ssr: false,
  loading: () => <CyberLoading />,
});

export default function LivePage() {
  const search = useSearchParams();
  const q = search.get('q') || 'game tournament';
  const tournamentId = search.get('tournamentId') || null;

  return (
    <main className="min-h-screen py-10 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <LiveTournament query={q} tournamentId={tournamentId} showChat={true} />
      </div>
    </main>
  );
}
