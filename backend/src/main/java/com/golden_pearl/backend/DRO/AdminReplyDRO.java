package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminReplyDRO(
        @NotBlank String reviewId,
        @NotBlank @Size(max = 2000) String adminReply
) {}
