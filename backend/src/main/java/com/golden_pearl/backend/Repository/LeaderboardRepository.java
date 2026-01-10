package com.golden_pearl.backend.Repository;

import com.golden_pearl.backend.Models.LeaderBoard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for LeaderBoard documents.
 * Extends MongoRepository for standard CRUD operations.
 */
@Repository
public interface LeaderboardRepository extends MongoRepository<LeaderBoard, String> {

    /**
     * Finds a leaderboard by its associated tournament's ID.
     * @param tournamentId The ID of the tournament.
     * @return An Optional containing the LeaderBoard if found.
     */
    Optional<LeaderBoard> findByTournamentId(String tournamentId);
}