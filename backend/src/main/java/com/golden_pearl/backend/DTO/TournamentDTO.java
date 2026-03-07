package com.golden_pearl.backend.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Data Transfer Object for a tournament.
 * This is used to control what data is sent back to the client.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
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
