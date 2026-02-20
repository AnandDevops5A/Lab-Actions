package com.golden_pearl.backend.Services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.DRO.ForgotPasswordDRO;
import com.golden_pearl.backend.DRO.UserAuth;
import com.golden_pearl.backend.DRO.UserRegisterData;
import com.golden_pearl.backend.DRO.ConfirmResetDRO;
import com.golden_pearl.backend.DRO.UserDetailsUpdateReceive;
import com.golden_pearl.backend.DTO.ForgotPasswordDTO;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.common.General;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmailService email;
    private final General general = new General();

    // constructor

    public UserService(UserRepository userRepository, EmailService email) {
        this.userRepository = userRepository;
        this.email = email;
    }

    // find user by id

    @Cacheable(value = "user", key = "#id")
    public User findUserById(String id) {
        if (id == null)
            return null;
        System.out.println("Fetching user with id: " + id);
        User user = userRepository.findById(id).orElse(null);
        System.out.println("Db hit ");
        return user;
    }

    // verify user by contact and accessKey or contact and accessKey
    public ResponseEntity<User> getUser(UserAuth userAuth) {
        User user;
        Long contact = userAuth.contact();
        String accessKey = userAuth.accessKey();

        // Input validation: accessKey is mandatory, and either callsign or contact must
        // be present.
        if (accessKey == null || contact == null) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request
        }

        // contact must not be null here because of the validation above
        user = userRepository.findByContactAndAccessKey(contact, accessKey);

        if (user != null) {
            return ResponseEntity.ok(user); // 200 OK with user data
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Unauthorized
        }
    }

    // update Password
    public ResponseEntity<ForgotPasswordDTO> updatePassword(ForgotPasswordDRO fpDRO) {
        if (fpDRO == null || fpDRO.contact() == null || fpDRO.email() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        List<User> users = userRepository.findByContactAndEmail(fpDRO.contact(), fpDRO.email());

        // Use !isEmpty() instead of null check for Lists
        if (users != null && !users.isEmpty()) {
            // Use .get(0) instead of [0]
            User user = users.get(0);
            int OTP = general.generateOTP();
            ForgotPasswordDTO fDTO = ForgotPasswordDTO.builder()
                    .id(user.getId()).username(user.getUsername()).otp(OTP).build();
            // send otp through mail
            try {
                email.sendForgetPasswordEmailOTP(user.getEmail(), user.getUsername(), OTP);

            } catch (Exception e) {
                System.out.println(e);
            }
            return ResponseEntity.ok(fDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // confirm reset password
    @Caching(evict = {
            @CacheEvict(value = "user", key = "#confirmResetData.id()"),
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public ResponseEntity<String> confirmResetPassword(ConfirmResetDRO confirmResetData) {
        if (confirmResetData == null || confirmResetData.id() == null || confirmResetData.accessKey() == null) {
            return ResponseEntity.badRequest().body("Invalid input");
        }

        User user = userRepository.findById(confirmResetData.id()).orElse(null);
        if (user != null && !(user.getAccessKey().equals(confirmResetData.accessKey()))) {
            user.setAccessKey(confirmResetData.accessKey());
            userRepository.save(user);
            // send password reset email
            try {
                email.sendPasswordResetEmail(user.getEmail(), user.getUsername());
            } catch (Exception e) {
                System.out.println(e);
            }
            return ResponseEntity.ok("Password reset successfully");
        } else
            return ResponseEntity.ok("Password set....");

    }

    // save user
    @Caching(evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public ResponseEntity<String> saveUser(UserRegisterData user) {
        // check data have enough data
        if ((user == null) || (user.username() == null) ||
                (user.callSign() == null) ||
                (user.contact() == null) ||
                (user.accessKey() == null)
                || (user.email() == null)) {
            
            return ResponseEntity.badRequest().body("All fields are required");
        }
        if (userRepository.existsByContact(user.contact())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this contact already exists.");
            }

        else {
            User readyUser = general.convertResponseToUser(user);
            userRepository.save(readyUser);
            return ResponseEntity.ok("User saved successfully");
        }

    }

    // get all users
    @Cacheable(value = "users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // update user
    @Caching(evict = {
            @CacheEvict(value = "user", key = "#user.userId()"),
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public ResponseEntity<User> updateUser(UserDetailsUpdateReceive user) {
         if (user.userId() == null) {
            return ResponseEntity.badRequest().build();
        }
        User existingUser = userRepository.findById(user.userId()).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        else{
            User updatedUser = existingUser.toBuilder()
                    .name(user.name())
                    .email(user.email())
                    .contact(user.contact())
                    .callSign(user.callSign())
                    .accessKey(user.accessKey())
                    .build();
            return ResponseEntity.ok(userRepository.save(updatedUser));
        }

       
    }

    // get users by ids
    @Cacheable(value = "usersByIds", key = "#userIds.toString()")
    public ResponseEntity<List<User>> getUsersByIds(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<User> users = userRepository.findAllById(userIds);
        return ResponseEntity.ok(users);
    }

    // bulk save users
    @Caching(evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public ResponseEntity<List<User>> saveAllUsers(List<User> users) {
        if (users == null || users.isEmpty()) {
            return ResponseEntity.badRequest().build();
        } else {
            for (User user : users) {
                user.setJoiningDate(general.getCurrentDateTime());
            }
            List<User> savedUsers = userRepository.saveAll(users);
            return ResponseEntity.ok(savedUsers);
        }
    }

}
