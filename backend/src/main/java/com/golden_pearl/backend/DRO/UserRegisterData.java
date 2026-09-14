package com.golden_pearl.backend.DRO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegisterData(
                @NotBlank @Size(min = 2, max = 80) String username,
                @NotBlank @Size(min = 2, max = 40) String callSign,
                @NotBlank @Email @Size(max = 254) String email,
                @NotBlank @Pattern(regexp = "^(?:[\\d]{10}|\\+[\\d]{10,15})$") String contact,
                @NotBlank @Size(min = 6, max = 128) String accessKey) {
}
        
