package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConfirmResetDRO(
        @NotBlank String id,
        @NotBlank @Size(min = 6, max = 128) String accessKey
) {}
