package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
/**
 * Data Receive Object for updating a tournament.
 * Using a record for an immutable data carrier.
 */

public record TournamentUpdateDRO(
    @NotBlank(message = "Tournament ID cannot be blank") String id,
    String tournamentName,
    Integer prizePool,
    Long dateTime,
    Integer entryFee,
    Integer slot,
    String platform,
    String description
) {}
