package com.golden_pearl.backend.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.golden_pearl.backend.Models.LeaderBoard;

public interface LeaderboardRepository extends MongoRepository<LeaderBoard, String> {

    // Find all entries for a specific tournament
    List<LeaderBoard> findByTournamentId(String tournamentId);

    // Find all entries for a specific user (Note: 'id' field refers to user ID in LeaderBoard model)
    List<LeaderBoard> findByUserId(String userId);

    // Find a specific user's entry in a specific tournament
    LeaderBoard findByTournamentIdAndUserId(String tournamentId, String userId);

    // Find multiple users' entries in a specific tournament
    List<LeaderBoard> findByTournamentIdAndUserIdIn(String tournamentId, List<String> userIds);


    // Get leaderboard for a tournament sorted by rank (Ascending: 1, 2, 3...)
    List<LeaderBoard> findByTournamentIdOrderByRankAsc(String tournamentId);

    // Get leaderboard for a tournament sorted by rank with pagination (for Top N)
    List<LeaderBoard> findByTournamentIdOrderByRankAsc(String tournamentId, Pageable pageable);

    // Get leaderboard for a tournament sorted by score (Descending: High to Low)
    List<LeaderBoard> findByTournamentIdOrderByScoreDesc(String tournamentId);

    // Get paginated leaderboard for a tournament sorted by score (Descending: High to Low)
    Page<LeaderBoard> findByTournamentIdOrderByScoreDesc(String tournamentId, Pageable pageable);

     List<LeaderBoard> findByTournamentIdIn(List<String> tournamentIds);
}
