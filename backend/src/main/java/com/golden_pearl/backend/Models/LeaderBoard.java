package com.golden_pearl.backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "leaderboard")
public class LeaderBoard {

    @Id
    private String id;
    private String userId;
    private String tournamentId;
    private String email;
    private String transactionId;
    private Integer investAmount;
    private Integer winAmount;
    private Integer rank;
    private Integer time;

}
