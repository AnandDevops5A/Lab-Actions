package com.golden_pearl.backend.Services;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Models.UserAuth;
import com.golden_pearl.backend.Repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @CacheEvict(value = "adminData", allEntries = true)
    public User addUser(User user) {
        return userRepository.save(user);
    }

    // verify user by callsign and accessKey or contact and accessKey
    public ResponseEntity<User> getUser(UserAuth userAuth) {
        User user;
        String callsign = userAuth.getCallSign();
        Long contact = userAuth.getContact();
        String accessKey = userAuth.getAccessKey();

        // Input validation: accessKey is mandatory, and either callsign or contact must be present.
        if (accessKey == null || (callsign == null && contact == null)) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request
        }

        if (callsign != null) {
            user = userRepository.findByCallSignAndAccessKey(callsign, accessKey);
        } else { // contact must not be null here because of the validation above
            user = userRepository.findByContactAndAccessKey(contact, accessKey);
        }

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
            return ResponseEntity.ok(userRepository.save(user));
        }
    }
}
