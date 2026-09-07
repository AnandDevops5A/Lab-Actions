package com.golden_pearl.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.golden_pearl.backend.DTO.TournamentWithLeaderboard;
import com.golden_pearl.backend.Models.LeaderBoard;

import io.lettuce.core.dynamic.annotation.Param;

public interface LeaderboardRepository extends JpaRepository<LeaderBoard, String> {


    // Fetch top leaderboard entries for a tournament with User details pre-fetched
    @Query("SELECT lb FROM LeaderBoard lb " +
           "JOIN FETCH lb.user " +
           "WHERE lb.tournamentId = :tournamentId " +
           "ORDER BY lb.score DESC, lb.createdAt ASC")
    List<LeaderBoard> findTopByTournamentIdWithUser(@Param("tournamentId") String tournamentId);

    // Fetch single leaderboard entry with User details by transactionId
    @Query("SELECT lb FROM LeaderBoard lb " +
           "JOIN FETCH lb.user " +
           "WHERE lb.transactionId = :transactionId")
    Optional<LeaderBoard> findByTransactionIdWithUser(@Param("transactionId") String transactionId);

       boolean existsByTransactionId(String transactionId);

    // Fetch all entries for a specific user with both User and Tournament pre-fetched
    @Query("SELECT lb FROM LeaderBoard lb " +
           "JOIN FETCH lb.user " +
           "JOIN FETCH lb.tournament " +
           "WHERE lb.userId = :userId " +
           "ORDER BY lb.createdAt DESC")
    List<LeaderBoard> findAllByUserIdWithUserAndTournament(@Param("userId") String userId);
// Fetch all entries for a specific user with both User and Tournament pre-fetched
    @Query("SELECT lb FROM LeaderBoard lb " +
           "JOIN FETCH lb.user " +
           "JOIN FETCH lb.tournament " +
           "ORDER BY lb.createdAt DESC")
    List<LeaderBoard> findAllLeaderBoardEntries();

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

     //get all leaderboard entries for a specific user join tournament
    @Query("SELECT lb FROM LeaderBoard lb " +
           "LEFT JOIN FETCH lb.tournament " +
           "WHERE lb.userId = :userId " +
           "ORDER BY lb.time DESC")
    List<LeaderBoard> findAllByUserIdWithTournament(@Param("userId") String userId);

    List<LeaderBoard> findTop5ByTournamentIdOrderByRankAsc(String id);
    List<LeaderBoard> findByTournamentIdAndRankBetween(String tournamentId, int start, int end);

}
