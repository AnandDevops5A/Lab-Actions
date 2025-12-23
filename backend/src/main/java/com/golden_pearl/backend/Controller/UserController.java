package com.golden_pearl.backend.Controller;

import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Models.UserAuth;
import com.golden_pearl.backend.Services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}