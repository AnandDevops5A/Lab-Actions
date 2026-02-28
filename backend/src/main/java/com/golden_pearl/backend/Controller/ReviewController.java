package com.golden_pearl.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import com.golden_pearl.backend.DRO.AdminReplyDRO;
import com.golden_pearl.backend.DRO.ReviewDRO;
import com.golden_pearl.backend.DRO.ReviewUpdateReceive;
import com.golden_pearl.backend.Models.Review;
import com.golden_pearl.backend.Services.ReviewService;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@Valid @RequestBody ReviewDRO review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @PostMapping("/all")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable String userId) {
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable String reviewId) {
        if (reviewId == null || reviewId.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid review ID");
        }
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }

    @PutMapping("/admin-reply")
    public ResponseEntity<String> addAdminReply(@Valid @RequestBody AdminReplyDRO adminReply) {
        return ResponseEntity.ok(reviewService.saveAdminReply(adminReply));

    }

    @PutMapping("/update")
    public ResponseEntity<Review> updateReview(@Valid @RequestBody ReviewUpdateReceive review) {
        if (review == null || review.reviewId() == null || review.reviewId().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Review updatedReview = reviewService.updateReview(review);
        if (updatedReview != null) {
            return ResponseEntity.ok(updatedReview);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/test")
    public String testEndpoint() {
        return "ReviewController is working!";
    }

}