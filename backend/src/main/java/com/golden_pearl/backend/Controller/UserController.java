package com.golden_pearl.backend.Controller;

import java.util.List;

import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Models.UserAuth;
import com.golden_pearl.backend.Services.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:8082/")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/verify")
    public ResponseEntity<User> verifyUser(@RequestBody UserAuth userAuth) {
        // System.err.println("Received user auth data: " + userAuth);
        return userService.getUser(userAuth);  
    }
    
    @PostMapping("/register")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        // System.out.println("Received user data: " + user);
        return userService.saveUser(user);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        System.out.println("Received user data: " + user);
        return userService.updateUser(user);
    }
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {        
        return userService.getAllUsers();
    } 
    
    //testing purpose
    @GetMapping("/test")    
    public String testEndpoint() {
        return "UserController is working!";
    }
    //save all user
    @PostMapping("/saveAll")
    public ResponseEntity<List<User>> saveAllUsers(@RequestBody List<User> users) {
        // System.out.println("Received users data: " + users);
        return userService.saveAllUsers(users);
    }
    //join tournament
    @PutMapping("/joinTournament/{userId}/{tournamentId}")
    public ResponseEntity<User> joinTournament(@PathVariable String userId, @PathVariable String tournamentId) {
        return userService.joinTournament(userId, tournamentId);
    }


    

    
}
