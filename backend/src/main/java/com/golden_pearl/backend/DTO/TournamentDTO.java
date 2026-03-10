package com.golden_pearl.backend.DTO;


public record TournamentDTO(
    String id,
    String tournamentName,
    Integer prizePool,
    Long dateTime,
    Integer entryFee,
    Integer slot,
    String platform,
    String description
) {}
