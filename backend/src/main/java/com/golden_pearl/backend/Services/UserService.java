package com.golden_pearl.backend.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.golden_pearl.backend.DRO.ForgotPasswordDRO;
import com.golden_pearl.backend.DRO.UserAuth;
import com.golden_pearl.backend.DRO.UserRegisterData;
import com.golden_pearl.backend.DRO.ConfirmResetDRO;
import com.golden_pearl.backend.DRO.UserDetailsUpdateReceive;
import com.golden_pearl.backend.DTO.ForgotPasswordDTO;
import com.golden_pearl.backend.DTO.UserDTO;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.common.General;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmailService email;
    private final PasswordEncoder passwordEncoder;
    private final General general;

    // constructor

    public UserService(UserRepository userRepository, EmailService email, PasswordEncoder passwordEncoder,
            General general) {
        this.userRepository = userRepository;
        this.email = email;
        this.passwordEncoder = passwordEncoder;
        this.general = general;
    }

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    // find user by id
    public User findUserById(String id) {
        if (id == null)
            return null;
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.isPresent() ? userOptional.get() : null;

    }

    @Transactional
    public User getUser(UserAuth userAuth) {
        String contact = userAuth.contact();
        String accessKey = userAuth.accessKey();

        if (contact == null || accessKey == null) {
            throw new IllegalArgumentException("Contact and Access Key are required");
        }

        // Check for modern BCrypt match (Hash comparison)
        Optional<User> potentialUserOptional = userRepository.findByPhoneNumber(contact);
        if (potentialUserOptional.isPresent()
                && passwordEncoder.matches(accessKey, potentialUserOptional.get().getAccessKey())) {
            User potentialUser = potentialUserOptional.get();

            // potentialUser.getPlayerIds().size();
            // }
            userRepository.save(potentialUser);
            return potentialUser;
        }

        return null; // Authorization fails (Controller handles 401)
    }

    // update Password
    public ForgotPasswordDTO updatePassword(ForgotPasswordDRO fpDRO) {
        if (fpDRO == null || fpDRO.phoneNumber() == null || fpDRO.email() == null) {
            return null;
        }
        List<User> users = userRepository.findByPhoneNumberAndEmail(fpDRO.phoneNumber(), fpDRO.email());

        // Use !isEmpty() instead of null check for Lists
        if (users != null && !users.isEmpty()) {
            // Use .get(0) instead of [0]
            User user = users.get(0);
            int otp = general.generateOTP();
            ForgotPasswordDTO fDTO = ForgotPasswordDTO.builder()
                    .id(user.getId()).username(user.getUsername()).otp(otp).build();
            // send otp through mail
            try {
                email.sendForgetPasswordEmailOTP(user.getEmail(), user.getUsername(), otp);

            } catch (Exception e) {
                logger.error("Failed to send OTP email to {}: {}", user.getEmail(), e.getMessage());
            }
            return fDTO;
        } else {
            return null;
        }
    }

    // confirm reset password
    @Caching(evict = {
            @CacheEvict(value = "user", key = "#confirmResetData.id()"),
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public String confirmResetPassword(ConfirmResetDRO confirmResetData) {
        if (confirmResetData == null || confirmResetData.id() == null || confirmResetData.accessKey() == null) {
            throw new IllegalArgumentException("Invalid input");
        }

        User user = userRepository.findById(confirmResetData.id()).orElse(null);
        if (user != null) {
            user.setAccessKey(passwordEncoder.encode(confirmResetData.accessKey()));
            userRepository.save(user);
            // send password reset email
            try {
                email.sendPasswordResetEmail(user.getEmail(), user.getUsername());
            } catch (Exception e) {
                logger.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
            }
            return "Password reset successfully";
        } else
            return "Password set....";

    }

    // save user
    @Caching(evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public String saveUser(UserRegisterData user) {
        // check data have enough data
        if ((user == null) || (user.username() == null) ||
                (user.callSign() == null) ||
                (user.contact() == null) ||
                (user.accessKey() == null)
                || (user.email() == null)) {

            throw new IllegalArgumentException("All fields are required");
        }
        if (userRepository.existsByPhoneNumber(user.contact())) {
            throw new IllegalArgumentException("User with this contact already exists.");
        }

        else {
            User readyUser = general.convertResponseToUser(user);
            // Hash the password before saving
            readyUser.setAccessKey(passwordEncoder.encode(readyUser.getAccessKey()));
            readyUser.setPasswordResetTimeLines(new ArrayList<>()); // Initialize passwordResetTimeLines as an empty
                                                                    // list
            userRepository.save(readyUser);
            return "User saved successfully";
        }

    }

    // update user
    @Caching(evict = {
            @CacheEvict(value = "user", key = "#user.userId()"),
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public User updateUser(UserDetailsUpdateReceive user) {
        if (user.userId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        User existingUser = userRepository.findById(user.userId()).orElse(null);
        if (existingUser == null) {
            return null;
        } else {

            // Update only provided fields; keep existing values if blank or null
            if (user.name() != null && !user.name().isBlank()) {
                existingUser.setUsername(user.name());
            }
            if (user.email() != null && !user.email().isBlank()) {
                existingUser.setEmail(user.email());
            }
            if (user.phoneNumber() != null) {
                existingUser.setPhoneNumber(user.phoneNumber());
            }
            if (user.callSign() != null && !user.callSign().isBlank()) {
                existingUser.setCallSign(user.callSign());
            }
            if (user.accessKey() != null && !user.accessKey().isBlank()) {
                existingUser.setAccessKey(passwordEncoder.encode(user.accessKey()));
            }

            return userRepository.save(existingUser);
        }

    }

    // get users by ids
    @Cacheable(value = "usersByIds", key = "#userIds.toString()", sync = true)
    public List<User> getUsersByIds(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            throw new IllegalArgumentException("User IDs cannot be empty");
        }
        return userRepository.findAllById(userIds);
    }

    // bulk save users
    @Caching(evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public List<User> saveAllUsers(List<User> users) {
        if (users == null || users.isEmpty()) {
            throw new IllegalArgumentException("Users list cannot be empty");
        } else {
            for (User user : users) {
                // user.setJoiningDate(general.getCurrentDate());
            }
            return userRepository.saveAll(users);

        }
    }

    // get all users
    @Cacheable(value = "users", sync = true)
    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(UserDTO::fromEntity).toList();
    }

}
