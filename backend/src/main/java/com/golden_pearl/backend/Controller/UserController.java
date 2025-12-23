package com.golden_pearl.backend.Controller;

import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Models.UserAuth;
import com.golden_pearl.backend.Services.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/verify")
    public ResponseEntity<User> verifyUser(@RequestBody UserAuth userAuth) {
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
    public ResponseEntity<java.util.List<User>> getAllUsers() {        
        return userService.getAllUsers();
    }   
}
