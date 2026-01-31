package com.golden_pearl.backend.Services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.DRO.UserAuth;
import com.golden_pearl.backend.DRO.UserRegisterData;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.common.General;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final General general = new General();

    // constructor

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // find user by id
    public User findUserById(String id) {
        return userRepository.findById(id).orElse(null);
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

    // save user
    @CacheEvict(value = "adminData", allEntries = true)
    public ResponseEntity<User> saveUser(UserRegisterData user) {
        // System.out.println(user);
        // check data have enough data
        if ((user == null) || (user.username() == null) ||
                (user.callSign() == null) ||
                (user.contact() == null) ||
                (user.accessKey()) == null) {

            return ResponseEntity.badRequest().body(null);
        }

        else {
            User readyUser = general.convertResponseToUser(user);
            // System.out.println(readyUser);

            return ResponseEntity.ok(userRepository.save(readyUser));
        }

    }

    // get all users
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // update user
    @CacheEvict(value = "adminData", allEntries = true)
    public ResponseEntity<User> updateUser(User user) {
        if (user.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userRepository.save(user));
    }


    // get users by ids
    public ResponseEntity<List<User>> getUsersByIds(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<User> users = userRepository.findAllById(userIds);
        return ResponseEntity.ok(users);
    }
    // bulk save users
    @CacheEvict(value = "adminData", allEntries = true)
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
