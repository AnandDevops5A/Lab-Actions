package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ForgotPasswordDRO(
        @NotBlank @Email @Size(max = 254) String email,
        @NotNull @Positive Long contact
) {}
