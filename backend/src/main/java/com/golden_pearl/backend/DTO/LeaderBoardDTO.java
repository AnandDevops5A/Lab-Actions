package com.golden_pearl.backend.DTO;

import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;

public record LeaderBoardDTO(String id, String username, String callSign, Integer score, Integer rank,
        String tournamentId, String tournamentName) {
    public static LeaderBoardDTO fromEntity(com.golden_pearl.backend.Models.LeaderBoard leaderBoard) {
        User u = leaderBoard.getUser();
        Tournament t = leaderBoard.getTournament();
        return new LeaderBoardDTO(
                leaderBoard.getId(),
                u.getUsername(),
                u.getCallSign(),
                leaderBoard.getScore(),
                leaderBoard.getRank(),
                t.getId(),
                t.getTournamentName());
    }

}
