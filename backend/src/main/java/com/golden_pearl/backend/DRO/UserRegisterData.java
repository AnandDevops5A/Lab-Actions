package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record UserRegisterData(
        @NotBlank @Size(min = 2, max = 80) String username,
        @NotBlank @Size(min = 2, max = 40) String callSign,
        @NotBlank @Email @Size(max = 254) String email,
        @NotNull @Positive Long contact,
        @NotBlank @Size(min = 6, max = 128) String accessKey
) {}
