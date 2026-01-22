'use client';
import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import { ThemeContext } from "../Library/ThemeContext";
import { errorMessage, successMessage, confirmMessage } from "../Library/Alert";
import { Trophy } from "lucide-react";
import dynamic from "next/dynamic";
import TournamentGrid from "./TournamentGrid";
import TournamentStatsHeader from "./TournamentStatsHeader";
import ParticipantManagementTable from "./ParticipantManagementTable";

const AddParticipantModal = dynamic(() => import('./AddParticipantModal'), {
  loading: () => <div className="text-green-400">Loading...</div>,
  ssr: false,
});

const ParticipantDetailsModal = dynamic(() => import('./ParticipantDetailsModal'), {
  loading: () => <div className="text-green-400">Loading...</div>,
  ssr: false,
});

import { approveUserFromTournament, getLeaderboard, getTopNLeaderboard, getUpcomingTournaments, getUpcomingTournamentsLeaderboard } from "../Library/API";

const ManageParticipant = ({ tournaments, participants, refreshData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingParticipant, setViewingParticipant] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [leaderboardCountRegisterUser, setleaderboardCountRegisterUser] = useState(null);

  const date = new Date();
  const dateOnly = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const currentTime = date.getHours() * 100 + date.getMinutes();
  const now = dateOnly * 10000 + currentTime;

  // Get upcoming tournaments only
  const upcomingTournaments = useMemo(() => {
    if (!tournaments) return [];
    return tournaments.filter(t => t.dateTime > now);
  }, [tournaments, now]);

  //add tournamnet to registerd users
 useEffect(() => {
    const fetchUpcomingTournamentsLeaderboard = async () => {
      const tournamentIds = upcomingTournaments.map(tournament => tournament.id);
      let list=Array.from(tournamentIds);
      try {
        const leaderboardData = await getUpcomingTournamentsLeaderboard(list);
        //make object with tournamentId as key and  no.of user id related to this tournamnet as value
        const countsMap = {};
        if (leaderboardData && Array.isArray(leaderboardData)) {
          leaderboardData.forEach(entry => {
            const tournamentId = entry.tournamentId;
            const userId = entry.userId;
            if (!countsMap[tournamentId]) {
              countsMap[tournamentId] = new Set();
            }
            countsMap[tournamentId].add(userId);
          });
  
          const finalCounts = {};
          for (const tournamentId in countsMap) {
            finalCounts[tournamentId] = countsMap[tournamentId].size;
          }
          setleaderboardCountRegisterUser(finalCounts);
          console.log("generted map with tournament id and register user", finalCounts);
        }
      } catch (error) {
        console.error("Error fetching upcoming tournaments leaderboard", error);
      }
    };

    //retrieve upcoming tournaments ids
    if (upcomingTournaments.length > 0 && !leaderboardCountRegisterUser) {
      fetchUpcomingTournamentsLeaderboard();
    }
    }, [upcomingTournaments, leaderboardCountRegisterUser]);


 

  // Get participants for selected tournament (from both approved list and leaderboard registrations)
  const tournamentParticipants = useMemo(() => {
    if (!selectedTournament || !participants) return [];

    // Get approved participant IDs
    const approvedParticipantIds = selectedTournament.participantIds || [];

    // Get participants who have registered via leaderboard (have transaction)
    const registeredUserIds = leaderboardData.map(lb => lb.userId);

    // Combine approved participants and registered participants
    const allParticipantIds = [...new Set([...approvedParticipantIds, ...registeredUserIds])];

    // Get participant details from users table
    const allParticipants = participants.filter(p => allParticipantIds.includes(p.id));

    // Add leaderboard data to each participant
    return allParticipants.map(participant => {
      const leaderboardEntry = leaderboardData.find(lb => lb.userId === participant.id);
      return {
        ...participant,
        leaderboardData: leaderboardEntry || null,
        isApproved: approvedParticipantIds.includes(participant.id),
        transactionId: leaderboardEntry?.transactionId || null
      };
    });
  }, [selectedTournament, participants, leaderboardData]);

  // Filter participants based on search
  const filteredParticipants = useMemo(() => {
    if (!tournamentParticipants) return [];

    return tournamentParticipants.filter(participant =>
      participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.callSign.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tournamentParticipants, searchTerm]);

  // Fetch leaderboard data when tournament is selected
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!selectedTournament) {
        setLeaderboardData([]);
        return;
      }

      setLoadingLeaderboard(true);
      try {
        const response = await getLeaderboard(selectedTournament.id);
        if (response.ok && response.data) {
          setLeaderboardData(response.data);
        } else {
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardData([]);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboardData();
  }, [selectedTournament]);

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

  const handleRemoveParticipant = useCallback(async (participantId) => {
    if (!selectedTournament) return;

    const confirmed = await confirmMessage(
      "Are you sure you want to remove this participant from the tournament?",
      "Remove Participant"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/tournament/${selectedTournament.id}/participant/${participantId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        successMessage("Participant removed successfully");
        if (refreshData) refreshData();
      } else {
        errorMessage("Failed to remove participant");
      }
    } catch (error) {
      errorMessage("An error occurred while removing the participant");
    }
  }, [selectedTournament, refreshData]);

  const appoveUserForTournament = useCallback(async (participantId) => {
    if (!selectedTournament) return;

    try {
      const response = await approveUserFromTournament(selectedTournament.id, participantId);
      if (response.ok) {
        successMessage("Participant approved successfully");
        if (refreshData) refreshData();
      } else {
        errorMessage("Failed to approve participant");
      }
    } catch (error) {
      errorMessage("An error occurred while approving the participant");
    }
    }, [selectedTournament, refreshData]);

  const handleBulkRemove = useCallback(async () => {
    if (!selectedTournament || selectedParticipants.length === 0) return;

    const confirmed = await confirmMessage(
      `Are you sure you want to remove ${selectedParticipants.length} participant(s) from this tournament?`,
      "Bulk Remove Participants"
    );

    if (!confirmed) return;

    try {
      const removePromises = selectedParticipants.map(participantId =>
        fetch(`${BASE_URL}/tournament/${selectedTournament.id}/participant/${participantId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(res => res.ok)
      );

      const results = await Promise.all(removePromises);
      const successCount = results.filter(Boolean).length;

      if (successCount === selectedParticipants.length) {
        successMessage(`Successfully removed ${successCount} participant(s)`);
        setSelectedParticipants([]);
        if (refreshData) refreshData();
      } else {
        errorMessage(`Failed to remove ${selectedParticipants.length - successCount} participant(s)`);
      }
    } catch (error) {
      console.error("Bulk remove error:", error);
      errorMessage("An error occurred during bulk removal");
    }
  }, [selectedTournament, selectedParticipants, refreshData]);


  // If no tournament selected, show list of upcoming tournaments
  if (!selectedTournament) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Trophy className={`mx-auto h-16 w-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-4`} />
          <h2 className="text-2xl font-bold text-white mb-4">Tournament Participant Management</h2>
          <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a tournament to manage its participants
          </p>
        </div>

        <div className={`rounded-lg border overflow-hidden p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-semibold mb-4 text-white">Available Tournaments</h3>
          <TournamentGrid
            tournaments={upcomingTournaments}
            onSelect={setSelectedTournament}
            isDarkMode={isDarkMode}
            leaderboardCountRegisterUser={leaderboardCountRegisterUser}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TournamentStatsHeader
        tournament={selectedTournament}
        participants={tournamentParticipants}
        onBack={() => setSelectedTournament(null)}
        isDarkMode={isDarkMode}
      />

      <ParticipantManagementTable
        participants={filteredParticipants}   
        selectedParticipants={selectedParticipants}
        onSelectParticipant={handleSelectParticipant}
        onSelectAll={handleSelectAll}
        onRemove={handleRemoveParticipant}
        onBulkRemove={handleBulkRemove}
        onAdd={() => setShowAddModal(true)}
        onView={setViewingParticipant}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        loading={loadingLeaderboard}
        isDarkMode={isDarkMode}
        approveUser={appoveUserForTournament}
      />

      {/* Modals */}
      {showAddModal && (
        <AddParticipantModal
          tournament={selectedTournament}
          participants={participants}
          onClose={() => setShowAddModal(false)}
          refreshData={refreshData}
        />
      )}

      {viewingParticipant && (
        <ParticipantDetailsModal
          participant={viewingParticipant}
          tournament={selectedTournament}
          leaderboardData={leaderboardData}
          onClose={() => setViewingParticipant(null)}
        />
      )}
    </div>
  );
};

export default ManageParticipant;