package com.golden_pearl.backend.DRO;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewDRO(
        String reviewId,
        @NotBlank @Size(max = 80) String reviewerName,
        @NotBlank @Size(max = 2000) String comment,
        @NotBlank String tournamentId,
        @NotNull @Min(1) @Max(5) Integer rating,
        String createdAt,
        List<String> tags
) {}
