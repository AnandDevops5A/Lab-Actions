"use client";
import React, { useState, useContext, useMemo, useCallback } from "react";
import { ThemeContext } from "../Library/ThemeContext";
import { useFetchBackendAPI } from "../Library/API";
import { errorMessage, successMessage, confirmMessage } from "../Library/Alert";

const BASE_URL = "http://localhost:8082";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Users,
  Trophy,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Settings,
  Plus,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  BarChart3,
  Play,
  Pause,
  CheckCircle,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

const AddTournamentForm = dynamic(() => import("./AddTournament"), {
  loading: () => <div className="text-green-400">Loading...</div>,
  ssr: false,
});

const EditTournamentForm = dynamic(() => import("./EditTournament"), {
  loading: () => <div className="text-green-400">Loading...</div>,
  ssr: false,
});

const TournamentDetailsModal = dynamic(
  () => import("./TournamentDetailsModal"),
  {
    loading: () => <div className="text-green-400">Loading...</div>,
    ssr: false,
  },
);

const TournamentManagement = ({ tournaments, refreshData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dateTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTournaments, setSelectedTournaments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [viewingTournament, setViewingTournament] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const date = new Date();
  const dateOnly =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const currentTime = date.getHours() * 100 + date.getMinutes();
  const now = dateOnly * 10000 + currentTime;

  // Get unique platforms for filter
  const platforms = useMemo(() => {
    if (!tournaments) return [];
    const uniquePlatforms = [...new Set(tournaments.map((t) => t.platform))];
    return uniquePlatforms.filter(Boolean);
  }, [tournaments]);

  // Filter and sort tournaments
  const filteredTournaments = useMemo(() => {
    if (!tournaments) return [];

    let filtered = tournaments.filter((tournament) => {
      const matchesSearch =
        tournament.tournamentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tournament.platform.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "upcoming" &&
          new Date(tournament.dateTime).getTime() > now) ||
        (statusFilter === "completed" &&
          new Date(tournament.dateTime).getTime() <= now);

      const matchesPlatform =
        platformFilter === "all" || tournament.platform === platformFilter;

      return matchesSearch && matchesStatus && matchesPlatform;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "dateTime") {
        aVal = a.dateTime;
        bVal = b.dateTime;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    tournaments,
    searchTerm,
    statusFilter,
    platformFilter,
    sortBy,
    sortOrder,
    now,
  ]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const handleSelectTournament = (tournamentId) => {
    setSelectedTournaments((prev) =>
      prev.includes(tournamentId)
        ? prev.filter((id) => id !== tournamentId)
        : [...prev, tournamentId],
    );
  };

  const handleSelectAll = () => {
    if (selectedTournaments.length === filteredTournaments.length) {
      setSelectedTournaments([]);
    } else {
      setSelectedTournaments(filteredTournaments.map((t) => t.id));
    }
  };

  const handleBulkDelete = useCallback(async () => {
    if (selectedTournaments.length === 0) return;

    const confirmed = await confirmMessage(
      `Are you sure you want to delete ${selectedTournaments.length} tournament(s)? This action cannot be undone.`,
      "Bulk Delete Tournaments",
    );

    if (!confirmed) return;

    try {
      const deletePromises = selectedTournaments.map((id) =>
        fetch(`${BASE_URL}/tournament/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.ok),
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;

      if (successCount === selectedTournaments.length) {
        successMessage(`Successfully deleted ${successCount} tournament(s)`);
        setSelectedTournaments([]);
        if (refreshData) refreshData();
      } else {
        errorMessage(
          `Failed to delete ${selectedTournaments.length - successCount} tournament(s)`,
        );
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      errorMessage("An error occurred during bulk deletion");
    }
  }, [selectedTournaments, refreshData]);

  const getStatusInfo = (tournament) => {
    if (new Date(tournament.dateTime).getTime() > now) {
      return {
        label: "UPCOMING",
        color: isDarkMode
          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
          : "text-amber-800 bg-amber-100 border-amber-200",
        dotColor: "bg-amber-400",
      };
    } else {
      return {
        label: "COMPLETED",
        color: isDarkMode
          ? "text-green-400 bg-green-500/10 border-green-500/20"
          : "text-green-800 bg-green-100 border-green-200",
        dotColor: "bg-green-400",
      };
    }
  };

  const formatDateTime = (dateTime) => {
    const dateStr = dateTime.toString();
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hour = dateStr.slice(8, 10);
    const minute = dateStr.slice(10, 12);

    return {
      date: `${day}/${month}/${year}`,
      time: `${hour}:${minute}`,
    };
  };

  const stats = useMemo(() => {
    if (!tournaments)
      return { total: 0, upcoming: 0, completed: 0, totalPrize: 0 };

    return tournaments.reduce(
      (acc, t) => ({
        total: acc.total + 1,
        upcoming: acc.upcoming + (t.dateTime > now ? 1 : 0),
        completed: acc.completed + (t.dateTime <= now ? 1 : 0),
        totalPrize: acc.totalPrize + (t.prizePool || 0),
      }),
      { total: 0, upcoming: 0, completed: 0, totalPrize: 0 },
    );
  }, [tournaments, now]);

  const deleteTournament = useCallback(
    async (tournamentId) => {
      const confirmed = await confirmMessage(
        "Are you sure you want to delete this tournament?",
        "Delete Tournament",
      );
      if (!confirmed) return;

      try {
        const response = await fetch(
          `${BASE_URL}/tournament/delete/${tournamentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          successMessage("Tournament deleted successfully");
          if (refreshData) refreshData();
        } else {
          errorMessage("Failed to delete tournament");
        }
      } catch (error) {
        errorMessage("An error occurred while deleting the tournament");
      }
    },
    [refreshData],
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Total Tournaments
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {stats.total}
              </p>
            </div>
            <Trophy
              className={`h-8 w-8 ${isDarkMode ? "text-green-400" : "text-green-600"}`}
            />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Upcoming
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {stats.upcoming}
              </p>
            </div>
            <Calendar
              className={`h-8 w-8 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`}
            />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Completed
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {stats.completed}
              </p>
            </div>
            <CheckCircle
              className={`h-8 w-8 ${isDarkMode ? "text-green-400" : "text-green-600"}`}
            />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Total Prize Pool
              </p>
              <p
                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                ₹{stats.totalPrize.toLocaleString()}
              </p>
            </div>
            <DollarSign
              className={`h-8 w-8 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}
            />
          </div>
        </div>
      </div>
      {!showAddForm ? (
        <>
          {/* Controls */}
          <div
            className={`animate-slideInDown p-4 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {selectedTournaments.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete ({selectedTournaments.length})
                  </button>
                )}

                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Tournament
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="all">All Status</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Platform
                    </label>
                    <select
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="all">All Platforms</option>
                      {platforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="dateTime">Date & Time</option>
                      <option value="tournamentName">Name</option>
                      <option value="prizePool">Prize Pool</option>
                      <option value="platform">Platform</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tournaments Table */}
          <div
            className={`animate-slideInDown rounded-lg border overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedTournaments.length ===
                            filteredTournaments.length &&
                          filteredTournaments.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort("tournamentName")}
                    >
                      <div className="flex items-center gap-1">
                        Tournament Name
                        {sortBy === "tournamentName" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort("platform")}
                    >
                      <div className="flex items-center gap-1">
                        Platform
                        {sortBy === "platform" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort("prizePool")}
                    >
                      <div className="flex items-center gap-1">
                        Prize Pool
                        {sortBy === "prizePool" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
                >
                  {filteredTournaments.map((tournament, index) => {
                    const statusInfo = getStatusInfo(tournament);
                    const { date, time } = formatDateTime(tournament.dateTime);

                    return (
                      <tr
                        key={tournament.id}
                        className={
                          selectedTournaments.includes(tournament.id)
                            ? isDarkMode
                              ? "bg-green-900/20 hover:bg-gray-600"
                              : "bg-green-50 hover:bg-gray-50"
                            : ""
                        }
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTournaments.includes(
                              tournament.id,
                            )}
                            onChange={() =>
                              handleSelectTournament(tournament.id)
                            }
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div>
                              <div
                                className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                              >
                                {tournament.tournamentName}
                              </div>
                              <div
                                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                              >
                                ID: {(index + 1).toString().padStart(3, "0")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dotColor}`}
                            ></span>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-700"}`}
                          >
                            {tournament.platform}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-sm font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                          >
                            ₹{tournament.prizePool?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
                          >
                            <div>{date}</div>
                            <div className="text-gray-500">{time}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-center">
                            <button
                              onClick={() => setViewingTournament(tournament)}
                              className={`p-1 rounded  ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* hide button for completed tournament */}
                            {new Date(tournament.dateTime).getTime() > now && (
                              <>
                                <button
                                  onClick={() =>
                                    setEditingTournament(tournament)
                                  }
                                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`}
                                  title="Edit Tournament"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    deleteTournament(tournament.id)
                                  }
                                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 hover:text-red-800"
                                  title="Delete Tournament"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <Trophy
                  className={`mx-auto h-12 w-12 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}
                />
                <h3
                  className={`mt-2 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
                >
                  No tournaments found
                </h3>
                <p
                  className={`mt-1 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  {searchTerm ||
                  statusFilter !== "all" ||
                  platformFilter !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "Get started by creating your first tournament."}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        //   {/* Modals */}
        <AddTournamentForm
          onClose={() => setShowAddForm(false)}
          refreshData={refreshData}
        />
      )}

      {editingTournament && (
        <EditTournamentForm
          tournament={editingTournament}
          onClose={() => setEditingTournament(null)}
          refreshData={refreshData}
        />
      )}

      {viewingTournament && (
        <TournamentDetailsModal
          tournament={viewingTournament}
          onClose={() => setViewingTournament(null)}
        />
      )}
    </div>
  );
};

export default TournamentManagement;
