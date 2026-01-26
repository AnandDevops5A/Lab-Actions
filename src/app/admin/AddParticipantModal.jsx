"use client";
import React, { useState, useMemo } from "react";
import { X, Search, UserPlus, Check } from "lucide-react";
import { errorMessage, successMessage } from "../../lib/utils/alert";
import { registerAllUsersForTournament } from "../../lib/api/backend-api";

const BASE_URL = "http://localhost:8082";

const AddParticipantModal = ({ tournament, participants, onClose, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out participants who are already in the tournament
  const availableParticipants = useMemo(() => {
    if (!participants) return [];

    // In a real app, you'd check against the tournament's participant list
    const tournamentParticipantIds = tournament.participantIds || [];
    return participants.filter(p => !tournamentParticipantIds.includes(p.id));
  }, [participants, tournament]);

  // Filter participants based on search
  const filteredParticipants = useMemo(() => {
    return availableParticipants.filter(participant =>
      participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.callSign.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableParticipants, searchTerm]);

  const handleSelectParticipant = (participantId) => {
    setSelectedParticipants(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedParticipants.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await registerAllUsersForTournament(tournament.id, selectedParticipants);
      if (response.ok) {
        successMessage("Participants added successfully");
        if (refreshData) refreshData();
        onClose();
      } else {
        errorMessage(response.error || "Failed to add participants");
      }
    } catch (error) {
      console.error("Add participants error:", error);
      errorMessage("An error occurred while adding participants");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-h-screen bg-[#050505] flex items-center justify-center md:p-3 font-mono w-full max-w-4xl">
        <div className="relative w-full p-0.5 bg-linear-to-br from-blue-500 via-transparent to-purple-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="bg-black p-5 sm:p-10 relative border border-blue-900/50 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close add participants"
              className="absolute top-0 right-0 bg-red-600 p-2 text-white hover:bg-blue-400 hover:text-black transition-colors z-50 group cursor-pointer"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 20% 100%)" }}
            >
              <X size={24} className="group-hover:rotate-180 transition-transform" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-blue-400 italic hover:text-purple-300 transition-colors">
                Add Participants{" "}
                <span className="text-purple-500 text-sm sm:text-lg animate-pulse">
                  [v2.001]
                </span>
              </h2>
              <div className="h-1 w-20 bg-blue-500 mt-2"></div>
              <p className="text-gray-400 mt-2">
                Add participants to: <span className="text-white font-semibold">{tournament.tournamentName}</span>
              </p>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search available participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 focus:border-blue-500 p-3 outline-none text-blue-300 placeholder:text-gray-700 transition-all rounded-lg"
                />
              </div>
            </div>

            {/* Participant List */}
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="border border-gray-800 rounded-lg">
                {/* Header */}
                <div className="p-3 border-b border-gray-800 bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-800"
                      />
                      <span className="text-sm text-gray-300">
                        Select All ({filteredParticipants.length} available)
                      </span>
                    </div>
                    <span className="text-sm text-blue-400">
                      {selectedParticipants.length} selected
                    </span>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`p-3 border-b border-gray-800 hover:bg-gray-900/30 cursor-pointer transition-colors ${
                        selectedParticipants.includes(participant.id) ? 'bg-blue-900/20 border-blue-500/30' : ''
                      }`}
                      onClick={() => handleSelectParticipant(participant.id)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => handleSelectParticipant(participant.id)}
                          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-800"
                        />
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-700 text-blue-400">
                          {participant.username ? participant.username.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{participant.username}</div>
                          <div className="text-gray-400 text-sm">{participant.callSign} • {participant.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 text-sm">₹{participant.investAmount?.toLocaleString() || 0}</div>
                          <div className="text-gray-500 text-xs">{participant.totalPlay || 0} games</div>
                        </div>
                        {selectedParticipants.includes(participant.id) && (
                          <Check className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredParticipants.length === 0 && (
                  <div className="text-center py-8">
                    <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-400">
                      {searchTerm ? 'No participants found matching your search.' : 'No available participants to add.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                {selectedParticipants.length} participant(s) selected
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedParticipants.length === 0 || isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium transition-colors rounded-lg flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Add Participants
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddParticipantModal;



