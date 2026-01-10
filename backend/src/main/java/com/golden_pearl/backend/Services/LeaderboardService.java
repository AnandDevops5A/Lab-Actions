package com.golden_pearl.backend.Services;

import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.LeaderboardEntry;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.LeaderboardRepository;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Service class for managing leaderboards.
 * Contains logic for fetching, generating, and calculating leaderboard data.
 */
@Service
public class LeaderboardService {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private UserRepository userRepository; // Assuming this repository exists

    @Autowired
    private TournamentRepository tournamentRepository; // Assuming this repository exists

    /**
     * Fetches the leaderboard for a specific tournament.
     * @param tournamentId The ID of the tournament.
     * @return An Optional of the LeaderBoard.
     */
    public Optional<LeaderBoard> getLeaderboardByTournament(String tournamentId) {
        return leaderboardRepository.findByTournamentId(tournamentId);
    }
    
    /**
     * Constructs a global leaderboard based on overall player stats.
     * @return A LeaderBoard object representing global rankings.
     */
    public LeaderBoard getGlobalLeaderboard() {
        List<User> allUsers = userRepository.findAll();

        // This logic assumes the User model has a `getWins()` method for overall wins.
        List<LeaderboardEntry> globalRankings = allUsers.stream()
                .sorted(Comparator.comparing(User::getWins).reversed())
                .map(this::mapUserToLeaderboardEntry)
                .collect(Collectors.toList());
        
        // Assign ranks to the sorted list.
        AtomicInteger rank = new AtomicInteger(1);
        globalRankings.forEach(entry -> entry.setRank(rank.getAndIncrement()));
        
        LeaderBoard globalLeaderboard = new LeaderBoard();
        globalLeaderboard.setId("global"); // Static ID for the global leaderboard
        globalLeaderboard.setRankings(globalRankings);
        
        return globalLeaderboard;
    }

    /**
     * Generates (or updates) the leaderboard for a specific tournament.
     * In a real-world scenario, this logic would be much more complex, likely
     * involving aggregation pipelines to calculate tournament-specific stats.
     * @param tournamentId The ID of the tournament.
     * @return The generated or updated LeaderBoard.
     */
    public LeaderBoard generateTournamentLeaderboard(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found with id: " + tournamentId));

        // DEMO LOGIC: This uses all users and their global stats. A real implementation
        // should fetch only the tournament's participants and calculate their stats
        // (wins, score) specifically for that tournament.
        List<User> participants = userRepository.findAll(); 

        AtomicInteger rank = new AtomicInteger(1);
        List<LeaderboardEntry> rankings = participants.stream()
                .sorted(Comparator.comparing(User::getWins).reversed()) // Should be tournament-specific wins
                .map(user -> new LeaderboardEntry(
                    user,
                    rank.getAndIncrement(),
                    user.getScore(), // Should be tournament-specific score
                    user.getWins(),  // Should be tournament-specific wins
                    calculateReward(rank.get() - 1)
                ))
                .collect(Collectors.toList());

        // Find existing leaderboard to update it, or create a new one.
        LeaderBoard leaderboard = leaderboardRepository.findByTournamentId(tournamentId)
                .orElse(new LeaderBoard());
        
        leaderboard.setTournament(tournament);
        leaderboard.setRankings(rankings);
        
        return leaderboardRepository.save(leaderboard);
    }

    private LeaderboardEntry mapUserToLeaderboardEntry(User user) {
        // Assumes User has getScore() and getWins()
        return new LeaderboardEntry(user, 0, user.getScore(), user.getWins(), 0);
    }

    // Example logic for calculating rewards based on rank.
    private double calculateReward(int rank) {
        if (rank == 1) return 10000;
        if (rank == 2) return 5000;
        if (rank == 3) return 2500;
        if (rank <= 10) return 500;
        return 100; // Participation reward
    }
}