package com.golden_pearl.backend.DTO;



public record TournamentDTO(
        String id,
        String tournamentName,
        Integer prizePool,
        Long dateTime,
        Integer entryFee,
        Integer slot,
        String platform,
        String description,
        String liveStreamLink
) {
    public static TournamentDTO fromEntity(com.golden_pearl.backend.Models.Tournament tournament) {
        return new TournamentDTO(
                tournament.getId(),
                tournament.getTournamentName(),
                tournament.getPrizePool(),
                tournament.getDateTime(),
                tournament.getEntryFee(),
                tournament.getSlot(),
                tournament.getPlatform(),
                tournament.getDescription(),
                tournament.getLiveStreamLink()
        );
    }
} 