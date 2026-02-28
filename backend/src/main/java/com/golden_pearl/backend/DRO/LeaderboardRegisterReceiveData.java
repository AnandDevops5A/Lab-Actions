package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LeaderboardRegisterReceiveData(
        @NotBlank String tournamentId,
        @NotBlank String userId,
        @Size(max = 128) String transactionId,
        @Size(max = 254) String tempEmail,
        @Size(max = 64) String gameId
) {}
