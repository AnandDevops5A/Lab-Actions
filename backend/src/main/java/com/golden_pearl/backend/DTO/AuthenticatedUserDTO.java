package com.golden_pearl.backend.DTO;

import java.util.List;

public record AuthenticatedUserDTO(
        String id,
        String username,
        List<String> playerId,
        String callSign,
        String email,
        Long contact,
        Long joiningDate,
        Integer withdrawAmount,
        Integer balanceAmount,
        Integer totalWin,
        boolean active,
        String token,
        boolean admin
) {}

