package com.golden_pearl.backend.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.golden_pearl.backend.Services.AdminService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;

@RestController
@RequestMapping("/admin")
@RateLimiter(name = "apiRateLimiter")
public class AdminController {

    private final AdminService adminService;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    public AdminController(@Lazy AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getAllData() {
        logger.info("Admin hit server by requesting /admin/data endpoint");
        return ResponseEntity.ok(adminService.getAllData());
    }
}
