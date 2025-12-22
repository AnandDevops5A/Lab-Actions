package com.golden_pearl.backend.Services;

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

    public User addUser(User user) {
        return userRepository.save(user);
    }

    // verify user by callsign and accessKey or contact and accessKey
    public ResponseEntity<User> getUser(UserAuth userAuth) {
        User user = null;
        String callsign = userAuth.getCallSign();
        Long contact = userAuth.getContact();
        String accessKey = userAuth.getAccessKey();

        if (callsign != null && accessKey != null) {
            user = userRepository.findByCallSignAndAccessKey(callsign, accessKey);
            return ResponseEntity.ok(user);
        } else if (contact != null && accessKey != null) {
            user = userRepository.findByContactAndAccessKey(contact, accessKey);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.ok(user);
        }
    }

    public ResponseEntity<User> saveUser(User user) {
        if (user == null) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.ok(userRepository.save(user));
        }
    }
}
