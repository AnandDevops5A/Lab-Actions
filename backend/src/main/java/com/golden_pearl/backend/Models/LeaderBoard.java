package com.golden_pearl.backend.Models;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Represents the leaderboard for a specific tournament.
 * This document aggregates ranking data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "leaderboards") // Using plural is a common convention
public class LeaderBoard {
    
    @Id
    private String id;

    // Using @DBRef to create a managed reference to the Tournament document.
    @DBRef
    private Tournament tournament;

    // A list of entries provides a much richer structure for ranking data.
    private List<LeaderboardEntry> rankings;

    // Timestamps are crucial for auditing.
    // Enable this with @EnableMongoAuditing in your Spring config.
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

}
