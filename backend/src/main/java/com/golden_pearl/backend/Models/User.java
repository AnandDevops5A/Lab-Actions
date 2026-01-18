package com.golden_pearl.backend.Models;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
@Builder
public class User {

    @Id
    private String id;
    private String username;
    private List<String> playerId;
    private String callSign;
    private String email;
    private String accessKey;
    private Long contact;
    private Long joiningDate;
    private Integer investAmount;
    private Integer winAmount=0;
    private Integer withdrawAmount;
    private Integer balanceAmount;
    private Integer totalWin;
    @Builder.Default
    private boolean active = true;
    private List<String> playedTournaments;


}