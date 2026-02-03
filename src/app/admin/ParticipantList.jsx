import React, { useMemo, useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  Edit3,
  Save,
  X,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  confirmMessage,
  errorMessage,
  successMessage,
} from "../../lib/utils/alert";
import { approveParticipantForTournament, updateParticipantTournamentStatus } from "@/lib/api/backend-api";

const ParticipantList = ({
  selectedTournament,
  isDarkMode,
  refreshData,
  onBack,
  joiners,
  updateJoiners,
}) => {
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editData, setEditData] = useState({
    rank: "",
    investAmount: "",
    winAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const now = Date.now();

  const selectedTournamentJoiners = useMemo(() => {
    return joiners.filter(
      (joiner) => joiner.tournamentId == selectedTournament.id,
    );
  }, [joiners, selectedTournament.id]);

  const parseTournamentDate = (dateTime) => {
    const dateStr = dateTime.toString();
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1;
    const day = parseInt(dateStr.slice(6, 8));
    const hour = parseInt(dateStr.slice(8, 10));
    const minute = parseInt(dateStr.slice(10, 12));
    return new Date(year, month, day, hour, minute).getTime();
  };

  const getEditableFields = (tournament) => {
    if (parseTournamentDate(tournament.dateTime) > now) {
      return {
        canEditInvest: true,
        canEditRank: false,
        canEditWin: false,
        type: "upcoming",
      };
    } else {
      return {
        canEditInvest: false,
        canEditRank: true,
        canEditWin: true,
        type: "completed",
      };
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return isDarkMode ? "text-yellow-400" : "text-yellow-600";
      case 2:
        return isDarkMode ? "text-gray-400" : "text-gray-600";
      case 3:
        return isDarkMode ? "text-amber-400" : "text-amber-600";
      default:
        return isDarkMode ? "text-gray-400" : "text-gray-600";
    }
  };

  const handleEditParticipant = (participant, tournament) => {
    setEditingParticipant(participant.id);
    const editableFields = getEditableFields(tournament);

    const newEditData = { rank: "", investAmount: "", winAmount: "" };

    if (editableFields.canEditRank) {
      newEditData.rank = participant.rank || "";
    }
    if (editableFields.canEditInvest) {
      newEditData.investAmount = participant.investAmount || "";
    }
    if (editableFields.canEditWin) {
      newEditData.winAmount = participant.winAmount || "";
    }

    setEditData(newEditData);
  };

  const handleSaveParticipant = async (
    participantId,
    tournamentId,
    tournament,
  ) => {
    const editableFields = getEditableFields(tournament);

    if (editableFields.canEditRank && !editData.rank) {
      errorMessage("Please fill in the rank");
      return;
    }
    if (editableFields.canEditInvest && !editData.investAmount) {
      errorMessage("Please fill in the invest amount");
      return;
    }
    if (editableFields.canEditWin && !editData.winAmount) {
      errorMessage("Please fill in the win amount");
      return;
    }

    setLoading(true);
    try {
      const updateData = {};
      if (editableFields.canEditRank && editData.rank) {
        updateData.rank = parseInt(editData.rank);
      }
      if (editableFields.canEditInvest && editData.investAmount) {
        updateData.investAmount = parseInt(editData.investAmount);
      }
      if (editableFields.canEditWin && editData.winAmount) {
        updateData.winAmount = parseInt(editData.winAmount);
      }

      const response = await updateParticipantTournamentStatus(participantId,updateData,);

      if (response.ok) {
        const message =
          editableFields.type === "upcoming"
            ? "Investment amount updated successfully"
            : "Rank and reward updated successfully";
        successMessage(message);
        setEditingParticipant(null);
        setEditData({ rank: "", investAmount: "", winAmount: "" });
        if (updateJoiners) updateJoiners();
      } else {
        errorMessage("Failed to update participant data");
      }
    } catch (error) {
      console.error("Error updating participant:", error);
      errorMessage("An error occurred while updating participant data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingParticipant(null);
    setEditData({ rank: "", investAmount: "", winAmount: "" });
  };

  const approveParticipant = async (participantId) => {
    const confirmed = await confirmMessage(
      "Approve this participant's results?",
      "Confirm Approval",
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await approveParticipantForTournament(participantId);
      if (response.ok) {
        successMessage("Participant approved successfully");
        if (updateJoiners) updateJoiners();
      } else {
        errorMessage("Failed to approve participant");
      }
    } catch (error) {
      console.error("Error approving participant:", error);
      errorMessage("An error occurred while approving participant");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBack && onBack()}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {/* close button */}
            <X className="w-5 h-5" />
          </button>

          <h2
            className={`text-2xl font-bold flex items-center gap-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}
          >
            <Trophy className="w-8 h-8" />
            {selectedTournament.tournamentName}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <div className="text-sm">
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Prize Pool:{" "}
              </span>
              <span
                className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}
              >
                ₹ {selectedTournament.prizePool?.toLocaleString()}
              </span>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-lg ${
              parseTournamentDate(selectedTournament.dateTime) > now
                ? isDarkMode
                  ? "bg-amber-500/80 text-blue-200"
                  : "bg-blue-100 text-blue-800"
                : isDarkMode
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {parseTournamentDate(selectedTournament.dateTime) > now
              ? "UPCOMING"
              : "COMPLETED"}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedTournamentJoiners && selectedTournamentJoiners.length > 0 ? (
          <div className="space-y-4">
            {selectedTournamentJoiners.map((participant) => (
              <div
                key={participant.id}
                className={`p-4 ${isDarkMode ? "hover:bg-gray-800/30" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(participant.rank)}
                      <span
                        className={`font-bold ${getRankColor(participant.rank)}`}
                      >
                        Rank #{participant.rank || "Unranked"}
                      </span>
                    </div>

                    <div>
                      <div
                        className={`font-medium ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}
                      >
                        {participant.tempEmail || `User ${participant.userId}`}
                      </div>
                      <div
                        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        ID: {participant.userId}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {editingParticipant === participant.id ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {getEditableFields(selectedTournament)
                            .canEditRank && (
                            <input
                              type="number"
                              placeholder="Rank"
                              value={editData.rank}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  rank: e.target.value,
                                }))
                              }
                              className={`w-16 px-2 py-1 text-sm rounded border ${
                                isDarkMode
                                  ? "bg-gray-700 border-gray-600 text-slate-100"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                              min="1"
                            />
                          )}
                          {getEditableFields(selectedTournament)
                            .canEditInvest && (
                            <input
                              type="number"
                              placeholder="Invest Amount"
                              value={editData.investAmount}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  investAmount: e.target.value,
                                }))
                              }
                              className={`w-24 px-2 py-1 text-sm rounded border ${
                                isDarkMode
                                  ? "bg-gray-700 border-gray-600 text-slate-100"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                              min="0"
                            />
                          )}
                          {getEditableFields(selectedTournament).canEditWin && (
                            <input
                              type="number"
                              placeholder="Win Amount"
                              value={editData.winAmount}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  winAmount: e.target.value,
                                }))
                              }
                              className={`w-24 px-2 py-1 text-sm rounded border ${
                                isDarkMode
                                  ? "bg-gray-700 border-gray-600 text-slate-100"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                              min="0"
                            />
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleSaveParticipant(
                              participant.id,
                              selectedTournament.id,
                              selectedTournament,
                            )
                          }
                          disabled={loading}
                          className={`p-1 rounded ${
                            isDarkMode
                              ? "hover:bg-green-600"
                              : "hover:bg-green-500"
                          } text-slate-100 bg-green-500`}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={`p-1 rounded ${
                            isDarkMode
                              ? "hover:bg-gray-600"
                              : "hover:bg-gray-300"
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                          >
                            ₹ {participant.investAmount?.toLocaleString() || 0}
                          </div>
                          <div
                            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            Invested
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                          >
                            ₹{participant.winAmount?.toLocaleString() || 0}
                          </div>
                          <div
                            className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            Win Amount
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleEditParticipant(
                                participant,
                                selectedTournament,
                              )
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              isDarkMode
                                ? "hover:bg-gray-700 text-gray-400"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                            title={
                              parseTournamentDate(selectedTournament.dateTime) <
                              now
                             ? "Edit Rank & Reward"
                                 :"Edit Investment Amount"
                            }
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {!participant.isApproved ? (
                            <button
                              onClick={() =>
                                approveParticipant &&
                                approveParticipant(participant.id)
                              }
                              disabled={loading}
                              className={`p-2 rounded-lg transition-colors ${
                                isDarkMode
                                  ? "hover:bg-green-700 text-green-400"
                                  : "hover:bg-green-100 text-green-600"
                              }`}
                              title="Approve Results"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isDarkMode
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              Approved
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No participants found for this tournament</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantList;
