package com.golden_pearl.backend.DRO;

public record ReviewUpdateReceive(String reviewId, String comment,  int rating, String createdAt
        ) {

}
