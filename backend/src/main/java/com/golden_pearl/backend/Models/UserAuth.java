package com.golden_pearl.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserAuth {
    private String callSign;
    private Long contact;
    private String accessKey;
}
