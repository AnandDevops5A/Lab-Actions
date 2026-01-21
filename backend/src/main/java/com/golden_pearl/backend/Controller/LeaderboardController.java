package com.golden_pearl.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.golden_pearl.backend.DRO.LeaderboardRegisterReceiveData;
import com.golden_pearl.backend.DRO.UpdateRank;
import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Services.LeaderboardService;
import com.golden_pearl.backend.Services.TournamentService;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final TournamentService tournamentService;

    public LeaderboardController(LeaderboardService leaderboardService, TournamentService tournamentService) {
        this.leaderboardService = leaderboardService;
        this.tournamentService = tournamentService;
    }

    // register user for tournament
    @PostMapping("/register")
    public ResponseEntity<String> registerUserForTournament(@RequestBody LeaderboardRegisterReceiveData registerData) {
        System.out.println("Received registration data: " + registerData);
        return leaderboardService.registerUserForTournament(registerData); 
    
        
    }

    @PostMapping("/{tournamentId}")
    public ResponseEntity<List<LeaderBoard>> getLeaderboard(@PathVariable String tournamentId) {
        return leaderboardService.getLeaderboard(tournamentId);
    }
    
        @PostMapping("/updateRank")
        public ResponseEntity<String> updateRank(@RequestBody UpdateRank updateRankData) {
            return leaderboardService.updateRank(updateRankData.tournamentId(), updateRankData.userId(), updateRankData.rank());
        }

    @GetMapping("/{tournamentId}/top/{n}")
    public ResponseEntity<List<LeaderBoard>> getTopNLeaderboard(@PathVariable String tournamentId, @PathVariable int n) {
        return leaderboardService.getTopNLeaderboard(tournamentId, n);
    }

    @PostMapping("/updateScore/{tournamentId}/{userId}/{score}")
    public ResponseEntity<String> updateScore(@PathVariable String tournamentId, @PathVariable String userId, @PathVariable int score) {
        return leaderboardService.updateScore(tournamentId, userId, score);
    }
    @PostMapping("/user/{userId}")
    public ResponseEntity<List<LeaderBoard>> getJoinedUsersTournaments(@PathVariable String userId) {
        return leaderboardService.getJoinedUsersTournaments(userId);
    }   
}
