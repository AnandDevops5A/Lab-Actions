package com.golden_pearl.backend.DTO;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.golden_pearl.backend.Models.User;

public record AuthenticatedUserDTO(
                String id,
                String username,
                // List<String> playerIds,
                String callSign,
                String email,
                String contact,
                Instant joiningDate,
                BigDecimal withdrawAmount,
                BigDecimal balanceAmount,
                boolean active,
                boolean admin
                ) {

        public static AuthenticatedUserDTO fromEntity(User user, boolean isAdmin) {
                return new AuthenticatedUserDTO(
                                user.getId(),
                                user.getUsername(),
                                // user.getPlayerIds(),
                                user.getCallSign(),
                                user.getEmail(),
                                user.getPhoneNumber(),
                                user.getCreatedAt(),
                                user.getWithdrawAmount(),
                                user.getBalanceAmount(),
                                user.isActive(),
                                isAdmin
                                );
        }
}
