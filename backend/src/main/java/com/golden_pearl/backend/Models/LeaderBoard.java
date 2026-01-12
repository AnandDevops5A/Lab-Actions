package com.golden_pearl.backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "leaderboard")
public class LeaderBoard {

    @Id
    private String leaderboardId;
    //tournament id
    @DBRef
    private Tournament tournament;
    //user id
    @DBRef
    private User user;
    //user score in tournament
    private Integer score;
    //rank of user in tournament
    private Integer rank;

}
