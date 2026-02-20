package com.golden_pearl.backend.Services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.DRO.AdminReplyDRO;
import com.golden_pearl.backend.DRO.ReviewDRO;
import com.golden_pearl.backend.DRO.ReviewUpdateReceive;
import com.golden_pearl.backend.Models.Review;
import com.golden_pearl.backend.Repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Caching(evict = {
            @CacheEvict(value = "reviews", allEntries = true),
            @CacheEvict(value = "userReviews", allEntries = true)
    })
    public Review addReview(ReviewDRO review) {
        Review newReview = Review.builder().reviewId(review.reviewId()).reviewerName(review.reviewerName())
                .comment(review.comment()).tournamentId(review.tournamentId())
                .rating(review.rating()).createdAt(review.createdAt()).tags(review.tags()).build();
        return reviewRepository.save(newReview);
    }

    @Cacheable(value = "reviews", sync = true)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Cacheable(value = "userReviews", key = "#userId", sync = true)
    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByReviewerName(userId);
    }

    @Caching(evict = {
            @CacheEvict(value = "reviews", allEntries = true),
            @CacheEvict(value = "userReviews", allEntries = true)
    })
    public void deleteReview(String reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    @Caching(evict = {
            @CacheEvict(value = "reviews", allEntries = true),
            @CacheEvict(value = "userReviews", allEntries = true)
    })
    public Review updateReview(ReviewUpdateReceive review) {
        Review existingReview = reviewRepository.findById(review.reviewId()).orElse(null);
        if (existingReview == null) {
            return null;
        }
        // Review  updatedReview =existingReview.toBuilder().comment(review.comment()).rating(review.rating())
        //         .createdAt(review.createdAt()).build();
                existingReview.setComment(review.comment());
                existingReview.setRating(review.rating());
                existingReview.setCreatedAt(review.createdAt());

        return reviewRepository.save(existingReview);
    }

    @Caching(evict = {
            @CacheEvict(value = "reviews", allEntries = true),
            @CacheEvict(value = "userReviews", allEntries = true)
    })
    public String saveAdminReply(AdminReplyDRO adminReply) {
        Review review = reviewRepository.findById(adminReply.reviewId()).orElse(null);
        try {
            if (review != null) {
                review.setAdminReply(adminReply.adminReply());
                reviewRepository.save(review);
                return "Reply Added";
            } else {
                return "Review not found";
            }
        } catch (Exception e) {
            return e.getMessage();
        }
    }

}