"use client";

import { FetchBackendAPI } from "@/lib/api/backend-api";
import { fetchUpcomingTournament } from "@/lib/utils/common";
import React, { useEffect, useState, useCallback } from "react";

/**
 * Settings component for managing platform configuration
 * Optimized with useCallback for event handlers
 */
const Settings = () => {
  const [platformName, setPlatformName] = useState("Gold_Pearl Tournament");
  const [adminEmail, setAdminEmail] = useState("admin@tournament.com");
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const getTournaments = async () => {
      try {
        const data = await fetchUpcomingTournament();
        if (isMounted && data) {
          setTournaments(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load tournaments.");
          console.error("Failed to fetch tournaments:", err);
        }
      }
    };
    getTournaments();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedTournamentId) {
      setError("Please select a tournament.");
      return;
    }
    if (!liveUrl.trim()) {
      setError("Live URL cannot be empty");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await FetchBackendAPI("tournament/set-live-stream-link", {
        method: "PUT",
        data: {
          tournamentId: selectedTournamentId,
          liveStreamLink: liveUrl.trim(),
        },
      });

      if (!response.ok) throw new Error("Save failed");

      setSaved(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [liveUrl, selectedTournamentId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">
        Settings & Configuration
      </h2>
      <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg space-y-6">
        <div>
          <h3 className="text-base md:text-lg font-bold mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-bold mb-2">
                Platform Name
              </label>
              <input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                type="text"
                disabled={!isEditing}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 md:px-4 py-2 text-slate-100 text-xs md:text-sm focus:border-orange-500 outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold mb-2">
                Admin Email
              </label>
              <input
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                type="email"
                disabled={!isEditing}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 md:px-4 py-2 text-slate-100 text-xs md:text-sm focus:border-orange-500 outline-none disabled:opacity-60"
              />
            </div>
            </div>
          </div>

        <div>
          <h3 className="text-base md:text-lg font-bold mb-4">Live Stream</h3>
          <p className="text-sm text-gray-400 mb-3">Paste a YouTube live video URL (or channel live URL) to show on the public &quot;Watch&quot; page.</p>
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          <div className="flex flex-col md:flex-row gap-3">
            <input value={liveUrl} onChange={e => { setLiveUrl(e.target.value); setSaved(false); }} placeholder="https://www.youtube.com/watch?v=..." disabled={!isEditing} className={`flex-1 bg-gray-900 border ${isEditing ? 'border-gray-700' : 'border-gray-600'} rounded px-3 md:px-4 py-2 text-slate-100 text-xs md:text-sm focus:border-orange-500 outline-none ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`} />
            <select
              value={selectedTournamentId}
              onChange={(e) => {
                setSelectedTournamentId(e.target.value);
                setIsEditing(true);
                setSaved(false);
              }}
              disabled={!isEditing}
              className={`bg-gray-900 border ${isEditing ? "border-gray-700" : "border-gray-600"} rounded px-3 md:px-4 py-2 text-slate-100 text-xs md:text-sm focus:border-orange-500 outline-none ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <option value="">Select Tournament</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>{t.tournamentName}</option>
              ))}
            </select>
            {saved && !isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-linear-to-r from-gray-600 to-gray-700 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base">
                Edit Live Link
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving || !selectedTournamentId || liveUrl.trim() === ''} className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base">
                {saving ? 'Saving…' : 'Save Live Link'}
              </button>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <button className="bg-linear-to-r from-orange-500 to-red-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:shadow-lg transition text-sm md:text-base">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
