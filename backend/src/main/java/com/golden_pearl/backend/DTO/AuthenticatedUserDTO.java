package com.golden_pearl.backend.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record AuthenticatedUserDTO(
        String id,
        String username,
        List<String> playerId,
        String callSign,
        String email,
        Long contact,
        LocalDate joiningDate,
        BigDecimal withdrawAmount,
        BigDecimal balanceAmount,
        boolean active,
        String token,
        boolean admin
) {}

