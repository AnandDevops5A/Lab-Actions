package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserAuth(
                @NotNull @Size(min = 10, max = 10) String contact,
                @NotBlank @Size(min = 6, max = 128) String accessKey) {
}
