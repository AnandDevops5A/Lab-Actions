package com.golden_pearl.backend.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.golden_pearl.backend.DRO.UserAuth;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.common.General;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private final General general = new General();

    // constructor

    public UserService(UserRepository userRepository, TournamentRepository tournamentRepository) {
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
    }

    // find user by id
    public User findUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    // verify user by callsign and accessKey or contact and accessKey
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
    public ResponseEntity<User> saveUser(User user) {
        if (user == null) {
            return ResponseEntity.badRequest().build();
        } else {
            user.setJoiningDate(general.getCurrentDateTime());
            return ResponseEntity.ok(userRepository.save(user));
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
