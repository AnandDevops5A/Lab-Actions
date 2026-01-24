package com.golden_pearl.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data@AllArgsConstructor@NoArgsConstructor
public class TournamentWithLeaderboard {
    
    private String TournamentName;
    private Integer prizePool;
    private Long dateTime;
    private String plateform;
    private String tempEmail;
    private String transactionId;
    private Integer investAmount;
    private Integer winAmount;
    private Integer rank;
}
