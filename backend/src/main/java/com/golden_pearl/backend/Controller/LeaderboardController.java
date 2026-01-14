package com.golden_pearl.backend.Controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Services.LeaderboardService;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    // register user for tournament
    @PostMapping("/register/{tournamentId}/{userId}")
    public ResponseEntity<String> registerUserForTournament(@PathVariable String tournamentId,
            @PathVariable String userId) {
                // System.out.println("Tournament ID: " + tournamentId + ", User ID: " + userId);
        return leaderboardService.registerUserForTournament(tournamentId, userId);
    }


}
