package com.golden_pearl.backend.DTO;

public record UserDTO(
        String id,
        String username,
        String callSign,
        String email,
        String contact,
        boolean active
) {
public static UserDTO fromEntity(com.golden_pearl.backend.Models.User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getCallSign(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.isActive()
        );
    }
    
}
