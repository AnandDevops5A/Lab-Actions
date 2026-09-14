package com.golden_pearl.backend.DTO;

import java.util.List;

import com.golden_pearl.backend.Models.LeaderBoard;

public record TournamentDTO(
        String id,
        String tournamentName,
        Integer prizePool,
        Long dateTime,
        Integer entryFee,
        Integer slot,
        String platform,
        String description,
        String liveStreamLink,
        List<String> joinedUsers) {
    public static TournamentDTO fromEntity(com.golden_pearl.backend.Models.Tournament tournament) {
        List<String> joinedUsers = tournament.getLeaderBoard().stream().map(LeaderBoard::getUserId).toList();

        return new TournamentDTO(
                tournament.getId(),
                tournament.getTournamentName(),
                tournament.getPrizePool(),
                tournament.getDateTime(),
                tournament.getEntryFee(),
                tournament.getSlot(),
                tournament.getPlatform(),
                tournament.getDescription(),
                tournament.getLiveStreamLink(),
                joinedUsers);
    }
}