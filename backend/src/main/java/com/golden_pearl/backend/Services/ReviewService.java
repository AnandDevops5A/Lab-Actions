package com.golden_pearl.backend.Services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.golden_pearl.backend.DRO.ReviewDRO;
import com.golden_pearl.backend.Models.Review;
import com.golden_pearl.backend.Repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review addReview(ReviewDRO review) {
        System.out.println(review);
        
       // Review newReview = new Review();
        Review newReview = Review.builder().reviewId(review.reviewId()).reviewerName(review.reviewerName()).comment(review.comment()).tournamentId(review.tournamentId())
                .rating(review.rating()).createdAt(review.createdAt()).tags(review.tags()).build();
        // return newReview;
        return reviewRepository.save(newReview);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByReviewerName(userId);
    }

    public void deleteReview(String reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    public Review updateReview(Review review) {
        return reviewRepository.save(review);
    }
}