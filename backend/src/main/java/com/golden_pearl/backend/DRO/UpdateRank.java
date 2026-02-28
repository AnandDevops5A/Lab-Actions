package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateRank(
        @NotBlank String tournamentId,
        @NotBlank String userId,
        @NotNull @Min(1) Integer rank
) {}
