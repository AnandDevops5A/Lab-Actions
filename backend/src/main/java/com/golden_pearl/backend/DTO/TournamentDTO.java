package com.golden_pearl.backend.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
