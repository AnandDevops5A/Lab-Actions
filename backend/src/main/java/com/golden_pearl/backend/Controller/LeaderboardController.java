package com.golden_pearl.backend.Controller;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.golden_pearl.backend.DRO.LeaderboardRegisterReceiveData;
import com.golden_pearl.backend.DRO.UpdateLeaderboardEntry;
import com.golden_pearl.backend.DRO.UpdateRank;
import com.golden_pearl.backend.DTO.TournamentWithLeaderboard;
import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Services.LeaderboardService;
import com.golden_pearl.backend.Services.TournamentService;
import com.golden_pearl.backend.errors.ResourceNotFoundException;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final TournamentService tournamentService;

    public LeaderboardController(LeaderboardService leaderboardService, TournamentService tournamentService) {
        this.leaderboardService = leaderboardService;
        this.tournamentService = tournamentService;
    }

    //get all leaderboard
    @GetMapping("/all")
    public ResponseEntity<List<LeaderBoard>> getAllLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getAllLeaderboard());
    }

    // register user for tournament
    @PostMapping("/register")
    public ResponseEntity<String> registerUserForTournament(@RequestBody LeaderboardRegisterReceiveData registerData) {
        try {
            String result = leaderboardService.registerUserForTournament(registerData);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/registerAll/{tournamentId}/users/{userIds}")
    public ResponseEntity<String> registerAllUsersForTournament(@PathVariable String tournamentId,
            @PathVariable List<String> userIds) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId);
        if (tournament == null) {
            return ResponseEntity.badRequest().body("Tournament not found");
        }
        return ResponseEntity.ok(leaderboardService.registerAllUsersForTournament(tournament, userIds));
    }

    @GetMapping("/getJoiners/{tournamentId}")
    public ResponseEntity<List<LeaderBoard>> getLeaderboard(@PathVariable String tournamentId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(tournamentId));
    }


    // get leaderboard by tournament ids

    @PostMapping("/getJoiners")
    public ResponseEntity<List<LeaderBoard>> getLeaderboardByTournamentIds(@RequestBody List<String> tournamentIds) {
        return ResponseEntity.ok(leaderboardService.getLeaderboardByTournamentIds(tournamentIds));
    }

    // approve user from tournament
    @PostMapping("/approve/{tournamentId}/user/{userId}")
    public ResponseEntity<String> approveUser(@PathVariable String tournamentId, @PathVariable String userId) {
        return ResponseEntity.ok(leaderboardService.approveUserFromTournament(tournamentId, userId));
    }

    

    @PostMapping("/updateRank")
    public ResponseEntity<String> updateRank(@RequestBody UpdateRank updateRankData) {
        return ResponseEntity.ok(leaderboardService.updateRank(updateRankData.tournamentId(), updateRankData.userId(),
                updateRankData.rank()));
    }

    @GetMapping("/{tournamentId}/top/{n}")
    public ResponseEntity<List<LeaderBoard>> getTopNLeaderboard(@PathVariable String tournamentId,
            @PathVariable int n) {
        return ResponseEntity.ok(leaderboardService.getTopNLeaderboard(tournamentId, n));
    }

    @PostMapping("/updateScore/{tournamentId}/{userId}/{score}")
    public ResponseEntity<String> updateScore(@PathVariable String tournamentId, @PathVariable String userId,
            @PathVariable int score) {
        return ResponseEntity.ok(leaderboardService.updateScore(tournamentId, userId, score));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TournamentWithLeaderboard>> getJoinedUsersTournaments(@PathVariable String userId) {
        List<TournamentWithLeaderboard> tournaments = leaderboardService.getTournamentsByUserId(userId);
        return ResponseEntity.ok(tournaments);
    }

    // Update leaderboard entry (rank, investAmount and winAmount)
    @PutMapping("/update/{leaderboardId}")
    public ResponseEntity<String> updateLeaderboardEntry(@PathVariable String leaderboardId, @RequestBody UpdateLeaderboardEntry updateData) {
        return ResponseEntity.ok(leaderboardService.updateLeaderboardEntry(leaderboardId, updateData.rank(), updateData.investAmount(), updateData.winAmount()));
    }

    // Approve leaderboard entry
    @PutMapping("/approve/{leaderboardId}")
    public ResponseEntity<String> approveLeaderboardEntry(@PathVariable String leaderboardId) {
        try {
            return ResponseEntity.ok(leaderboardService.approveLeaderboardEntry(leaderboardId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
