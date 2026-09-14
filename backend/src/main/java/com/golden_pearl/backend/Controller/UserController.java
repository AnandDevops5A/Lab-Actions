package com.golden_pearl.backend.Controller;

import com.golden_pearl.backend.common.General;
import java.util.List;
import java.util.Map;

import com.golden_pearl.backend.DRO.UserAuth;
import com.golden_pearl.backend.DRO.UserRegisterData;
import com.golden_pearl.backend.DTO.ForgotPasswordDTO;
import com.golden_pearl.backend.DTO.UserDTO;
import com.golden_pearl.backend.DTO.AuthenticatedUserDTO;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.security.AdminPolicy;
import com.golden_pearl.backend.security.JwtService;
import com.golden_pearl.backend.services.UserService;

import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
import jakarta.validation.Valid;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.HttpHeaders;

// @CrossOrigin("http://localhost:8082/")
@RestController
@RequestMapping("/api/users")
@RateLimiter(name = "apiRateLimiter")
public class UserController {

    private final General general;
    private final UserService userService;
    private final JwtService jwtService;
    private final AdminPolicy adminPolicy;
    private final EntityManager entityManager;

    public UserController(UserService userService, JwtService jwtService, AdminPolicy adminPolicy,
            EntityManager entityManager, General general) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.adminPolicy = adminPolicy;
        this.entityManager = entityManager;
        this.general = general;
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
    public ResponseEntity<Map<String,Object>> verifyUser(@Valid @RequestBody UserAuth userAuth) {
        try {
            User user = userService.getUser(userAuth);
            if (user != null) {
                boolean isAdmin = adminPolicy.isAdminContact(user.getPhoneNumber());
                System.out.println("isAdmin: " + isAdmin);
                String token = jwtService.createToken(user, isAdmin);
                AuthenticatedUserDTO dto = AuthenticatedUserDTO.fromEntity(user, isAdmin);
                ResponseCookie cookie = jwtService.generateJwtCookie(token);
                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body(general.response("success", "Login successful...", dto));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<ForgotPasswordDTO> updatePassword(@Valid @RequestBody ForgotPasswordDRO fpDRO) {
        ForgotPasswordDTO result = userService.updatePassword(fpDRO);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/confirm-reset")
    public ResponseEntity<String> confirmReset(@Valid @RequestBody ConfirmResetDRO confirmResetData) {
        try {
            return ResponseEntity.ok(userService.confirmResetPassword(confirmResetData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> saveUser(@Valid @RequestBody UserRegisterData user) {
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
    public ResponseEntity<User> updateUser(@Valid @RequestBody UserDetailsUpdateReceive user) {
        User updatedUser = userService.updateUser(user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    // save all user
    @PostMapping("/saveAll")
    public ResponseEntity<List<User>> saveAllUsers(@RequestBody List<User> users) {
        return ResponseEntity.ok(userService.saveAllUsers(users));
    }

    // testing purpose
    @GetMapping("/test")
    public Object isDatabaseUp() {
        String collectionName = "initCollection";

        Long userCount = entityManager.createQuery("select count(u) from User u", Long.class).getSingleResult();
        return "PostgreSQL is connected; users table contains " + userCount + " users.";
        // return userService.findAll();
        // return true;
    }
}
