package com.golden_pearl.backend.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.golden_pearl.backend.DRO.LeaderboardRegisterReceiveData;
import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.LeaderBoardRepository;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.common.General;

@Service
public class LeaderboardService {

    private final LeaderBoardRepository leaderboardRepository;
    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    public final General general = new General();

    public LeaderboardService(LeaderBoardRepository leaderboardRepository, UserRepository userRepository,
            TournamentRepository tournamentRepository) {
        this.leaderboardRepository = leaderboardRepository;
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
    }

    // register user for tournament
    @Transactional
  @PostMapping("/register")
public ResponseEntity<String> registerUserForTournament(@RequestBody LeaderboardRegisterReceiveData registerData) {
    try {
        // Check if user is already registered for this tournament
        Optional<LeaderBoard> existingEntry = leaderboardRepository
                .findByTournamentIdAndUserId(registerData.tournamentId(), registerData.userId());

        if (existingEntry.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User already registered for this tournament");
        }

        // Check if user exists
        User user = userRepository.findById(registerData.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if tournament exists
        Tournament tournament = tournamentRepository.findById(registerData.tournamentId())
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        // Create new LeaderBoard entry
        LeaderBoard newEntry = new LeaderBoard();
        newEntry.setUserId(registerData.userId());
        newEntry.setTournamentId(registerData.tournamentId());
        newEntry.setTempEmail(registerData.tempEmail());
        newEntry.setTransactionId(registerData.transactionId());
        newEntry.setTime(general.getCurrentTime());

        leaderboardRepository.save(newEntry);

        return ResponseEntity.ok(
                user.getUsername() + " registered successfully for the " + tournament.getTournamentName()
        );

    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error registering user: " + e.getMessage());
    }
}
    // get leaderboard for a tournament
    public ResponseEntity<List<LeaderBoard>> getLeaderboard(String tournamentId) {
        try {
            // Check if tournament exists
            Tournament tournament = tournamentRepository.findById(tournamentId).orElse(null);
            if (tournament == null) {
                return ResponseEntity.badRequest().build();
            }

            List<LeaderBoard> leaderboard = leaderboardRepository.findByTournamentIdOrderByRankAsc(tournamentId);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // get top n leaderboard for a tournament
    public ResponseEntity<List<LeaderBoard>> getTopNLeaderboard(String tournamentId, int n) {
        try {
            // Check if tournament exists
            Tournament tournament = tournamentRepository.findById(tournamentId).orElse(null);
            if (tournament == null) {
                return ResponseEntity.badRequest().build();
            }

            Pageable pageable = PageRequest.of(0, n);
            List<LeaderBoard> leaderboard = leaderboardRepository.findByTournamentIdOrderByScoreDesc(tournamentId,
                    pageable);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // update rank of user
    @Transactional
    public ResponseEntity<String> updateRank(String tournamentId, String userId, int rank) {
        try {
            // Find the LeaderBoard entry
            LeaderBoard entry = leaderboardRepository.findByTournamentIdAndUserId(tournamentId, userId);
            if (entry == null) {
                return ResponseEntity.badRequest().body("User not registered for this tournament");
            }
            if (entry.getRank() != null && entry.getRank() == rank) {
                return ResponseEntity.ok("Rank is already up to date");
            }
            entry.setRank(rank);

            leaderboardRepository.save(entry);

            return ResponseEntity.ok("Rank updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating rank: " + e.getMessage());
        }
    }

    // update score of user
    @Transactional
    public ResponseEntity<String> updateScore(String tournamentId, String userId, int score) {
        try {
            // Find the LeaderBoard entry
            LeaderBoard entry = leaderboardRepository.findByTournamentIdAndUserId(tournamentId, userId);
            if (entry == null) {
                return ResponseEntity.badRequest().body("User not registered for this tournament");
            }

            // Update the score using builder
            LeaderBoard updatedEntry = LeaderBoard.builder()
                    .id(entry.getId())
                    .userId(entry.getUserId())
                    .tournamentId(entry.getTournamentId())
                    .tempEmail(entry.getTempEmail())
                    .transactionId(entry.getTransactionId())
                    .investAmount(entry.getInvestAmount())
                    .winAmount(entry.getWinAmount())
                    .rank(entry.getRank())
                    .time(entry.getTime())
                    .score(score)
                    .build();

            leaderboardRepository.save(updatedEntry);

            return ResponseEntity.ok("Score updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating score: " + e.getMessage());
        }
    }

    // get tournaments joined by a user
    public ResponseEntity<List<LeaderBoard>> getJoinedUsersTournaments(String userId) {
        try {
            List<LeaderBoard> userTournaments = leaderboardRepository.findByUserId(userId);
            return ResponseEntity.ok(userTournaments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
