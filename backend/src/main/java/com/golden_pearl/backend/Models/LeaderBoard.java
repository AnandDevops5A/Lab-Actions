package com.golden_pearl.backend.Models;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "tournament_user")
public class LeaderBoard {

    @Id
    private String id;
    // private String tournamentId;
    private String userId;
    private Integer rank;
    private Integer investAmount;
    private Integer winAmount;
   

}
