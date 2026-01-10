package com.golden_pearl.backend.Models;

import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single entry on a leaderboard.
 * It links a user to their performance stats for a specific tournament.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardEntry {

    // A reference to the user this entry belongs to.
    @DBRef
    private User user;

    private int rank;       // The player's position (e.g., 1, 2, 3)
    private long score;      // The score achieved in this tournament
    private int wins;       // Number of wins in this tournament
    private double reward;   // Reward claimed for this rank
}
