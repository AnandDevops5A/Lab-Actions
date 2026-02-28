package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DeleteJoinersRequestDRO(
    @NotBlank(message = "Tournament ID is required")
    @Size(min = 24, max = 24, message = "Tournament ID must be 24 characters long")
    String tournamentId,
    @NotBlank(message = "User IDs are required")
    @Size(min = 24, max = 24, message = "User IDs must be 24 characters long")
    String userIds
) {}
