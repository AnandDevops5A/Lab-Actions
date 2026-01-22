import React from "react";
import {
  Search,
  UserMinus,
  UserPlus,
  Crown,
  Eye,
  Users,
  Signature,
} from "lucide-react";

const ParticipantManagementTable = ({
  participants,
  selectedParticipants,
  onSelectParticipant,
  onSelectAll,
  onRemove,
  onBulkRemove,
  onAdd,
  onView,
  searchTerm,
  onSearchChange,
  loading,
  isDarkMode,
  approveUser,
}) => {
  const getParticipantStatus = (participant) => {
    // console.log(participant.leaderboardData.isApproved);
    if (participant.leaderboardData.isApproved) {
      return participant.active ? "Approved" : "Registered";
    }
    if (participant.leaderboardData.transactionId && !participant.leaderboardData.isApproved) {
      return "Pending Approval";
    }
    return "Not Registered";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return isDarkMode
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-green-100 text-green-800 border-green-200";
      case "Registered":
        return isDarkMode
          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
          : "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending Approval":
        return isDarkMode
          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          : "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Not Registered":
        return isDarkMode
          ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
          : "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return isDarkMode
          ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div
        className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              />
              <input
                type="text"
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {selectedParticipants.length > 0 && (
              <button
                onClick={onBulkRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <UserMinus className="h-4 w-4" />
                Remove ({selectedParticipants.length})
              </button>
            )}

            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add Participant
            </button>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div
        className={`rounded-lg border overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {loading && (
          <div className="p-4 text-center">
            <div className="inline-flex items-center gap-2 text-green-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
              Loading leaderboard data...
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      participants.length > 0 &&
                      selectedParticipants.length === participants.length
                    }
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Games Played
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Winnings
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {participants.map((participant) => {
                const status = getParticipantStatus(participant);
                const totalGames = participant.totalPlay || 0;
                const wins = totalGames - (participant.totallosses || 0);
                const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
                const participantLeaderboard =
                  participant.leaderboardData || {};

                return (
                  <tr
                    key={participant.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedParticipants.includes(participant.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={() => onSelectParticipant(participant.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${isDarkMode ? "bg-gray-600 text-blue-400" : "bg-gray-200 text-gray-600"}`}
                        >
                          {participant.username
                            ? participant.username.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <div>
                          <div
                            className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {participant.username}
                          </div>
                          <div
                            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {participant.callSign}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === "Approved" ? "bg-green-400" : status === "Pending Approval" ? "bg-yellow-400" : "bg-blue-400"}`}
                        ></span>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-mono ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                      >
                        {participant.transactionId || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {participantLeaderboard.rank ? (
                          <>
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span
                              className={`text-sm font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}
                            >
                              #{participantLeaderboard.rank}
                            </span>
                          </>
                        ) : (
                          <span
                            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            N/A
                          </span>
                        )}
                      </div>
                    </td>
                    {/* <td className="px-4 py-4">
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {participantLeaderboard.score || 0}
                      </span>
                    </td> */}
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {totalGames}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-blue-500 to-purple-500"
                            style={{ width: `${winRate}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                        >
                          {winRate.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}
                      >
                        ₹{participant.investAmount?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                      >
                        ₹
                        {participantLeaderboard.winAmount?.toLocaleString() ||
                          0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onView(participant)}
                          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => approveUser(participant.id)}
                          className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-600 hover:text-red-800"
                          title="Approve from Tournament"
                        >
                          <Signature className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRemove(participant.id)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 hover:text-red-800"
                          title="Remove from Tournament"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {participants.length === 0 && (
          <div className="text-center py-12">
            <Users
              className={`mx-auto h-12 w-12 ${isDarkMode ? "text-gray-400" : "text-gray-400"} mb-4`}
            />
            <h3
              className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              No participants found
            </h3>
            <p
              className={`mt-1 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              {searchTerm
                ? "Try adjusting your search terms."
                : "Add participants to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManagementTable;
