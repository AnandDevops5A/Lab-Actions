package com.golden_pearl.backend.Controller;

import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Services.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for leaderboard-related endpoints.
 */
@RestController
@RequestMapping("/api/leaderboards") // Plural form is a REST convention for resources
@CrossOrigin(origins = "*") // Allows cross-origin requests, useful for development
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    /**
     * Retrieves the leaderboard for a specific tournament.
     * @param tournamentId The UUID of the tournament.
     * @return A ResponseEntity containing the LeaderBoard or 404 Not Found.
     */
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<LeaderBoard> getTournamentLeaderboard(@PathVariable String tournamentId) {
        return leaderboardService.getLeaderboardByTournament(tournamentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves the global leaderboard, aggregated from all player stats.
     * @return A ResponseEntity containing the global LeaderBoard.
     */
    @GetMapping("/global")
    public ResponseEntity<LeaderBoard> getGlobalLeaderboard() {
        LeaderBoard globalLeaderboard = leaderboardService.getGlobalLeaderboard();
        return ResponseEntity.ok(globalLeaderboard);
    }

    /**
     * [ADMIN] Triggers the generation and saving of a tournament's leaderboard.
     * In a production environment, this endpoint should be secured to be accessible
     * only by administrators.
     * @param tournamentId The UUID of the tournament to generate a leaderboard for.
     * @return A ResponseEntity containing the newly generated or updated LeaderBoard.
     */
    @PostMapping("/tournament/{tournamentId}/generate")
    public ResponseEntity<LeaderBoard> generateTournamentLeaderboard(@PathVariable String tournamentId) {
        try {
            LeaderBoard leaderboard = leaderboardService.generateTournamentLeaderboard(tournamentId);
            return ResponseEntity.ok(leaderboard);
        } catch (RuntimeException e) {
            // This will catch the "Tournament not found" exception from the service
            return ResponseEntity.notFound().build();
        }
    }
}