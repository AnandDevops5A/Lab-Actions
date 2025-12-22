package com.golden_pearl.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Models.UserAuth;
import com.golden_pearl.backend.Services.UserService;

@RestController
@RequestMapping("/users/")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test")
    public UserAuth getUserStatus(@RequestBody UserAuth userAuth) {
        return userAuth;
    }

    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @RequestMapping(path = "/verify", method = RequestMethod.POST)
    public ResponseEntity<User> verifyUser(@RequestBody UserAuth userAuth) {
        if (userAuth == null)
            return ResponseEntity.badRequest().build();

        else {
            return ResponseEntity.ok(userService.getUser(userAuth).getBody());
        }

    }

    @RequestMapping(path = "/register", method = RequestMethod.POST)
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @RequestMapping(path = "/update", method = RequestMethod.PUT)
    public ResponseEntity<User> updateUser(@RequestBody User user) {

        return userService.saveUser(user);

    }

}
