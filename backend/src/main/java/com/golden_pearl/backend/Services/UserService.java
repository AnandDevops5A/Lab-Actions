package com.golden_pearl.backend.Services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Models.UserAuth;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.common.General;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final General general = new General();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // verify user by callsign and accessKey or contact and accessKey
    public ResponseEntity<User> getUser(UserAuth userAuth) {
        User user;
        Long contact = userAuth.getContact();
        String accessKey = userAuth.getAccessKey();

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

    @CacheEvict(value = "adminData", allEntries = true)
    public ResponseEntity<User> saveUser(User user) {
        if (user == null) {
            return ResponseEntity.badRequest().build();
        } else {
            user.setJoiningDate(general.getCurrentDateTime());
            return ResponseEntity.ok(userRepository.save(user));
        }
    }

    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @CacheEvict(value = "adminData", allEntries=true)
    public ResponseEntity<User> updateUser(User user) {
        if (user.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userRepository.save(user));
    }
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
