package com.golden_pearl.backend.Models;


import java.util.HashMap;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "tournaments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tournament {
    
    @Id
    private String id;
    private String tournamentName;
    private Integer prizePool;
    private Long dateTime;
    private Integer entryFee;
    private String platform;
    private String description;
    private HashMap<String, Integer> rankList;
    private HashMap<String, Integer> invest;
    @DBRef
    private List<LeaderBoard> leaderBoard;


}
