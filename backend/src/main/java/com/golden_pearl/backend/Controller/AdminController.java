package com.golden_pearl.backend.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.golden_pearl.backend.services.AdminService;
import com.golden_pearl.backend.services.AdminDataStreamService;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;

@RestController
@RequestMapping("/api/admin")
@RateLimiter(name = "apiRateLimiter")
public class AdminController {

    private final AdminService adminService;
    private final AdminDataStreamService adminDataStreamService;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    public AdminController(@Lazy AdminService adminService, AdminDataStreamService adminDataStreamService) {
        this.adminService = adminService;
        this.adminDataStreamService = adminDataStreamService;
    }

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getAllData() {
        logger.info("Admin hit server by requesting /admin/data endpoint");
        return ResponseEntity.ok(adminService.getAllData());
    }

    @GetMapping(value = "/data/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamData() {
        return adminDataStreamService.connect();
    }
}
