package com.golden_pearl.backend.DTO;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import com.golden_pearl.backend.Models.LeaderBoard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public record TournamentWithLeaderboard (

    String TournamentName,
    Integer prizePool,
    String dateTime,
    String plateform,
    String tempEmail,
    String transactionId,
    Integer investAmount,
    Integer winAmount,
    Integer rank,
    Boolean isApproved){

        //from entity to DTO
        public static TournamentWithLeaderboard fromEntity(LeaderBoard leaderboard) {
            return new TournamentWithLeaderboard(
                leaderboard.getTournament().getTournamentName(),
                leaderboard.getTournament().getPrizePool(),
                formatDateTime(leaderboard.getTournament().getDateTime()),
                leaderboard.getTournament().getPlatform(),
                leaderboard.getTempEmail(),
                leaderboard.getTransactionId(),
                leaderboard.getInvestAmount().intValue(),
                leaderboard.getWinAmount().intValue(),
                leaderboard.getRank(),
                leaderboard.getIsApproved()
            );
        }

        private static String formatDateTime(Long epochMillis) {
            if (epochMillis == null) {
                return null;
            }
            return Instant.ofEpochMilli(epochMillis)
                    .atZone(ZoneId.of("Asia/Kolkata"))
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }
}
