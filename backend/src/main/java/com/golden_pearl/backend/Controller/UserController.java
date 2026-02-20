package com.golden_pearl.backend.Controller;

import java.util.List;

import com.golden_pearl.backend.DRO.UserAuth;
import com.golden_pearl.backend.DRO.UserRegisterData;
import com.golden_pearl.backend.DTO.ForgotPasswordDTO;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Services.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.golden_pearl.backend.DRO.ForgotPasswordDRO;
import com.golden_pearl.backend.DRO.ConfirmResetDRO;
import com.golden_pearl.backend.DRO.UserDetailsUpdateReceive;

// @CrossOrigin("http://localhost:8082/")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // find user by id
    @GetMapping("/{id}")
    public ResponseEntity<User> findUserById(@PathVariable String id) {
        User user = userService.findUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<User> verifyUser(@RequestBody UserAuth userAuth) {
        try {
            User user = userService.getUser(userAuth);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<ForgotPasswordDTO> updatePassword(@RequestBody ForgotPasswordDRO fpDRO) {
        ForgotPasswordDTO result = userService.updatePassword(fpDRO);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/confirm-reset")
    public ResponseEntity<String> confirmReset(@RequestBody ConfirmResetDRO confirmResetData) {
        try {
            return ResponseEntity.ok(userService.confirmResetPassword(confirmResetData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> saveUser(@RequestBody UserRegisterData user) {
        try {
            return ResponseEntity.ok(userService.saveUser(user));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // get all user by ids
    @GetMapping("/getUsersByIds/{userIds}")
    public ResponseEntity<List<User>> getUsersByIds(@PathVariable List<String> userIds) {
        return ResponseEntity.ok(userService.getUsersByIds(userIds));
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody UserDetailsUpdateReceive user) {
        User updatedUser = userService.updateUser(user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // save all user
    @PostMapping("/saveAll")
    public ResponseEntity<List<User>> saveAllUsers(@RequestBody List<User> users) {
        return ResponseEntity.ok(userService.saveAllUsers(users));
    }

    // testing purpose
    @GetMapping("/test")
    public String testEndpoint() {
        return "UserController is working!";
    }

}
