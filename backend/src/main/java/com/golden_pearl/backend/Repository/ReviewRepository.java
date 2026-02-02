package com.golden_pearl.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.golden_pearl.backend.Models.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByReviewerName(String reviewername);
}