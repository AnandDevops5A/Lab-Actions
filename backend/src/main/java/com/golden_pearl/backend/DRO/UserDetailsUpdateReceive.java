package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDetailsUpdateReceive(
        @NotBlank String userId,
        @Size(max = 80) String name,
        @Email @Size(max = 254) String email,
        Long contact,
        @Size(max = 40) String callSign,
        @Size(min = 6, max = 128) String accessKey
) {}
