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
import com.golden_pearl.backend.Services.LeaderBoardService;

@RestController
@RequestMapping("/leaderboard")
public class LeaderBoardController {

    private final LeaderBoardService leaderBoardService;

    public LeaderBoardController(LeaderBoardService leaderBoardService) {
        this.leaderBoardService = leaderBoardService;
    }

    // register user for tournament
    @PostMapping("/register/{tournamentId}/{userId}")
    public ResponseEntity<String> registerUserForTournament(@PathVariable String tournamentId,
            @PathVariable String userId) {
        return leaderBoardService.registerUserForTournament(tournamentId, userId);
    }

    // get all leaderboard entries
    @GetMapping("/all")
    public ResponseEntity<Page<LeaderBoard>> getAllLeaderBoard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return leaderBoardService.getAllLeaderBoard(pageable);
    }

    // get leaderboard by tournament id
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<Page<LeaderBoard>> getLeaderBoardByTournamentId(@PathVariable String tournamentId,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return leaderBoardService.getLeaderBoardByTournamentId(tournamentId, pageable);
    }

    // get leaderboard by user id
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LeaderBoard>> getLeaderBoardByUserId(@PathVariable String userId) {
        return leaderBoardService.getLeaderBoardByUserId(userId);
    }

    // get top n leaderboard entries by tournament id
    @GetMapping("/top/{tournamentId}/{n}")
    public ResponseEntity<List<LeaderBoard>> getTopNLeaderBoardByTournamentId(@PathVariable String tournamentId,
            @PathVariable int n) {
        return leaderBoardService.getTopNLeaderBoardByTournamentId(tournamentId, n);
    }

    // update score
    @PutMapping("/score/{tournamentId}/{userId}")
    public ResponseEntity<LeaderBoard> updateScore(@PathVariable String tournamentId, @PathVariable String userId,
            @RequestParam int score) {
        return leaderBoardService.updateScore(tournamentId, userId, score);
    }

}
