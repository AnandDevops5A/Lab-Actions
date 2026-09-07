package com.golden_pearl.backend.config;

import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import jakarta.servlet.http.HttpServletRequest;

import com.golden_pearl.backend.errors.ResourceNotFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException e, HttpServletRequest request) {
        log.warn("{} {} -> 404: {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", Instant.now().toString());
        errorResponse.put("message", "Resource not found");
        errorResponse.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException e, HttpServletRequest request) {
        log.warn("{} {} -> 400: {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", Instant.now().toString());
        errorResponse.put("message", "Invalid request");
        errorResponse.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException e, HttpServletRequest request) {
        log.warn("{} {} -> 400 validation failed: {}", request.getMethod(), request.getRequestURI(),
            e.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + "=" + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", ")));
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", Instant.now().toString());
        errorResponse.put("message", "Validation failed");
        errorResponse.put("errors", e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fe -> fe.getField(),
                        fe -> fe.getDefaultMessage() == null ? "Invalid value" : fe.getDefaultMessage(),
                        (a, b) -> a
                )));
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception e, HttpServletRequest request) {
        log.error("{} {} -> 500 unhandled exception", request.getMethod(), request.getRequestURI(), e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", Instant.now().toString());
        errorResponse.put("message", "An unexpected error occurred");
        // Do not leak internal exception details in production responses
        return ResponseEntity.internalServerError().body(errorResponse);
    }
}