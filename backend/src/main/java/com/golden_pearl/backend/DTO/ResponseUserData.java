package com.golden_pearl.backend.DTO;

import java.util.List;
import com.golden_pearl.backend.Models.Tournament;


public class ResponseUserData {

    private String id;
    private String userId;
    private String username;
    private List<String> playerId;
    private String callSign;
    private int totalWin;
    private List<Tournament> playedTournaments;
}
