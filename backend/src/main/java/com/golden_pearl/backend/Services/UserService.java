package com.golden_pearl.backend.Services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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

    @Cacheable(value = "user", key = "#id" ,sync = true)
    public User findUserById(String id) {
        if (id == null)
            return null;
        System.out.println("Fetching user with id: " + id);
        User user = userRepository.findById(id).orElse(null);
        System.out.println("Db hit ");
        return user;
    }

    // verify user by contact and accessKey or contact and accessKey
    public User getUser(UserAuth userAuth) {
        User user;
        Long contact = userAuth.contact();
        String accessKey = userAuth.accessKey();

        // Input validation: accessKey is mandatory, and either callsign or contact must
        // be present.
        if (accessKey == null || contact == null) {
            throw new IllegalArgumentException("Missing contact or access key");
        }

        // contact must not be null here because of the validation above
        user = userRepository.findByContactAndAccessKey(contact, accessKey);

        return user; // Returns null if not found (Controller handles 401)
    }

    // update Password
    public ForgotPasswordDTO updatePassword(ForgotPasswordDRO fpDRO) {
        if (fpDRO == null || fpDRO.contact() == null || fpDRO.email() == null) {
            return null;
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
        if (user != null && !(user.getAccessKey().equals(confirmResetData.accessKey()))) {
            user.setAccessKey(confirmResetData.accessKey());
            userRepository.save(user);
            // send password reset email
            try {
                email.sendPasswordResetEmail(user.getEmail(), user.getUsername());
            } catch (Exception e) {
                System.out.println(e);
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
        if (userRepository.existsByContact(user.contact())) {
                throw new IllegalArgumentException("User with this contact already exists.");
            }

        else {
            User readyUser = general.convertResponseToUser(user);
            userRepository.save(readyUser);
            return "User saved successfully";
        }

    }

    // get all users
    @Cacheable(value = "users", sync = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
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
        }
        else{
            // User updatedUser = existingUser.toBuilder()
            //         .name(user.name())
            //         .email(user.email())
            //         .contact(user.contact())
            //         .callSign(user.callSign())
            //         .accessKey(user.accessKey())
            //         .build();
            existingUser.setUsername(user.name());
            existingUser.setEmail(user.email());
            existingUser.setContact(user.contact());
            existingUser.setCallSign(user.callSign());
            existingUser.setAccessKey(user.accessKey());

            return userRepository.save(existingUser);
        }

       
    }

    // get users by ids
    @Cacheable(value = "usersByIds", key = "#userIds.toString()",sync = true)
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
                user.setJoiningDate(general.getCurrentDateTime());
            }
            List<User> savedUsers = userRepository.saveAll(users);
            return savedUsers;
        }
    }

}
