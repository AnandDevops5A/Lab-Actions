package com.golden_pearl.backend.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.golden_pearl.backend.Models.User;

public record AuthenticatedUserDTO(
                String id,
                String username,
                List<String> playerIds,
                String callSign,
                String email,
                String contact,
                LocalDate joiningDate,
                BigDecimal withdrawAmount,
                BigDecimal balanceAmount,
                boolean active,
                boolean admin,
                String token) {

        public static AuthenticatedUserDTO fromEntity(User user, boolean isAdmin, String token) {
                return new AuthenticatedUserDTO(
                                user.getId(),
                                user.getUsername(),
                                user.getPlayerIds(),
                                user.getCallSign(),
                                user.getEmail(),
                                user.getPhoneNumber(),
                                user.getJoiningDate(),
                                user.getWithdrawAmount(),
                                user.getBalanceAmount(),
                                user.isActive(),
                                isAdmin,
                                token);
        }
}
