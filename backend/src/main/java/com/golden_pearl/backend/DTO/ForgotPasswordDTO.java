package com.golden_pearl.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor@Builder
public class ForgotPasswordDTO {

    private String id;
    private String username;
    private Integer otp;
}
