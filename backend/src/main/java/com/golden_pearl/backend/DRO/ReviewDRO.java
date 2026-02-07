package com.golden_pearl.backend.DRO;

import java.util.List;

public record ReviewDRO(String reviewId, String reviewerName, String comment, String tournamentId, Integer rating, String createdAt,
        List<String> tags) {
    
}
