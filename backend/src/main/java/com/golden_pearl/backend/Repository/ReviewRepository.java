package com.golden_pearl.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.golden_pearl.backend.Models.Review;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByReviewerName(String reviewername);
}