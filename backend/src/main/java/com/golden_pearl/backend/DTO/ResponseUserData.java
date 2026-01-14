package com.golden_pearl.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseUserData {

    private String userId;
    private String username;
    private String callSign;
    private int totalWin;
   
}
