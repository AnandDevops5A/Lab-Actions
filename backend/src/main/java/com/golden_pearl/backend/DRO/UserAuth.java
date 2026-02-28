package com.golden_pearl.backend.DRO;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record UserAuth(
        @NotNull @Positive Long contact,
        @NotBlank @Size(min = 6, max = 128) String accessKey
) {}
