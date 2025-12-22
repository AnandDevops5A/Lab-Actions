package com.golden_pearl.backend.Models;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Document(collection = "tournaments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tournament {
    
    @Id
    private String id;
    private String tournamentName;
    private int prizePool;
    private Long dateTime;
    private int entryFee;
    private String platform;
    private List <String> participants;
    


}
