package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TournamentReceiveData(
        @NotBlank @Size(max = 100) String tournamentName,
        @NotNull @Positive Integer prizePool,
        @NotNull Long dateTime,
        @NotNull @Positive Integer slot,
        @NotBlank @Size(max = 40) String platform,
        @Size(max = 2000) String description
) {}
