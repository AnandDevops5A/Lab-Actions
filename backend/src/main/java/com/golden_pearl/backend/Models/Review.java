package com.golden_pearl.backend.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "reviews")
public class Review {
    @Id
    private String reviewId;
    private String reviewerName;
    private String tournamentId;
    private String comment;
    private Integer rating;
    private String createdAt;
    private List<String> tags;
    @Builder.Default
    private Integer likes=0;
    private String AdminReply;

}
