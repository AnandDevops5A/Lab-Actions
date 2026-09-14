package com.golden_pearl.backend.DRO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserAuth(
                @NotBlank @Pattern(regexp = "^(?:[\\d]{10}|\\+[\\d]{10,15})$") String contact,
                @NotBlank @Size(min = 6, max = 128) String accessKey) {
}
