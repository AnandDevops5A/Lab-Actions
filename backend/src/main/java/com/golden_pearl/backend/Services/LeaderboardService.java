package com.golden_pearl.backend.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
import com.golden_pearl.backend.Repository.LeaderboardRepository;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.errors.ResourceNotFoundException;
import com.golden_pearl.backend.common.General;

@Service
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private final TournamentService tournamentService;
    public final General general = new General();

    public LeaderboardService(LeaderboardRepository leaderboardRepository, UserRepository userRepository,
            TournamentRepository tournamentRepository, TournamentService tournamentService) {
        this.leaderboardRepository = leaderboardRepository;
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
        this.tournamentService = tournamentService;
    }

    // register user for tournament
    @Transactional
    @PostMapping("/register")
    public ResponseEntity<String> registerUserForTournament(@RequestBody LeaderboardRegisterReceiveData registerData) {
        // Check if user is already registered for this tournament
        LeaderBoard existingEntry = leaderboardRepository.findByTournamentIdAndUserId(registerData.tournamentId(),
                registerData.userId());

        if (existingEntry != null) {
            // This will be caught by GlobalExceptionHandler (mapped to 400 Bad Request)
            throw new IllegalArgumentException("You are already registered for this tournament");
        }

        // Check if user exists
        User user = userRepository.findById(registerData.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if tournament exists
        Tournament tournament = tournamentRepository.findById(registerData.tournamentId())
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found"));

        // Create new LeaderBoard entry
        LeaderBoard newEntry = new LeaderBoard();
        newEntry.setUserId(registerData.userId());
        newEntry.setTournamentId(registerData.tournamentId());
        newEntry.setTempEmail(registerData.tempEmail());
        newEntry.setTransactionId(registerData.transactionId());
        newEntry.setTime(general.getCurrentTime());

        leaderboardRepository.save(newEntry);
        System.out.println("User registered for tournament: " + newEntry);
        return ResponseEntity.ok(
                "You registered successfully for the " + tournament.getTournamentName());
    }

    // get leaderboard for a tournament
    public ResponseEntity<List<LeaderBoard>> getLeaderboard(String tournamentId) {
        // Check if tournament exists
        // Tournament tournament = tournamentRepository.findById(tournamentId)
        if (tournamentService.getTournamentById(tournamentId) == null) {
            throw new ResourceNotFoundException("Tournament not found");
        }

        List<LeaderBoard> leaderboard = leaderboardRepository.findByTournamentIdOrderByRankAsc(tournamentId);
        return ResponseEntity.ok(leaderboard);
    }

    // get top n leaderboard for a tournament
    public ResponseEntity<List<LeaderBoard>> getTopNLeaderboard(String tournamentId, int n) {
        // Check if tournament exists
        // Tournament tournament = tournamentRepository.findById(tournamentId)
        if (tournamentService.getTournamentById(tournamentId) == null) {
            throw new ResourceNotFoundException("Tournament not found");
        }

        Pageable pageable = PageRequest.of(0, n);
        Page<LeaderBoard> leaderboard = leaderboardRepository.findByTournamentIdOrderByScoreDesc(tournamentId,
                pageable);
        return ResponseEntity.ok(leaderboard.getContent());
    }

    // update rank of user
    @Transactional
    public ResponseEntity<String> updateRank(String tournamentId, String userId, int rank) {
        // Find the LeaderBoard entry
        LeaderBoard entry = leaderboardRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (entry == null) {
            throw new ResourceNotFoundException("User not registered for this tournament");
        }
        if (entry.getRank() != null && entry.getRank() == rank) {
            return ResponseEntity.ok("Rank is already up to date");
        }
        entry.setRank(rank);

        leaderboardRepository.save(entry);

        return ResponseEntity.ok("Rank updated successfully");
    }

    // update score of user
    @Transactional
    public ResponseEntity<String> updateScore(String tournamentId, String userId, int score) {
        // Find the LeaderBoard entry
        LeaderBoard entry = leaderboardRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (entry == null) {
            throw new ResourceNotFoundException("User not registered for this tournament");
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
    }

    // get tournaments joined by a user
    public ResponseEntity<List<LeaderBoard>> getJoinedUsersTournaments(String userId) {
        List<LeaderBoard> userTournaments = leaderboardRepository.findByUserId(userId);
        return ResponseEntity.ok(userTournaments);
    }

    public ResponseEntity<String> registerAllUsersForTournament(Tournament tournament, List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return ResponseEntity.ok("No users provided for registration");
        }

        // Fetch all existing entries for this tournament in one query
        List<LeaderBoard> existingEntries = leaderboardRepository.findByTournamentIdAndUserIdIn(tournament.getId(),
                userIds);

        if (existingEntries == null) {
            existingEntries = new ArrayList<>();
        }

        // Extract already registered userIds into a Set for fast lookup
        Set<String> registeredUserIds = existingEntries.stream().map(LeaderBoard::getUserId)
                .collect(Collectors.toSet());

        // Create new entries only for users not already registered
        List<LeaderBoard> entriesToSave = userIds.stream()
                .filter(userId -> !registeredUserIds.contains(userId))
                .map(userId -> {
                    LeaderBoard newEntry = new LeaderBoard();
                    newEntry.setUserId(userId);
                    newEntry.setTournamentId(tournament.getId());
                    newEntry.setTime(general.getCurrentTime());
                    newEntry.setIsApproved(true);
                    return newEntry;
                })
                .collect(Collectors.toList());

        // Save all new entries in bulk
        if (!entriesToSave.isEmpty()) {
            leaderboardRepository.saveAll(entriesToSave);
        }

        return ResponseEntity
                .ok("All users registered successfully for the tournament: " + tournament.getTournamentName());
    }

   public ResponseEntity<?> getLeaderboardByTournamentIds(List<String> tournamentIds) {
    List<LeaderBoard> leaderboard = leaderboardRepository.findByTournamentIdIn(tournamentIds);
    System.out.println("Leaderboard entries found: " + leaderboard.size());
    return ResponseEntity.ok(leaderboard);
}

    public ResponseEntity<String> approveUserFromTournament(String tournamentId, String userId) {
        // Find the LeaderBoard entry
        LeaderBoard entry = leaderboardRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (entry == null) {
            throw new ResourceNotFoundException("User not registered for this tournament");
        }
        if (entry.getIsApproved()) {
            return ResponseEntity.ok("User is already approved for this tournament");
        }
        entry.setIsApproved(true);

        leaderboardRepository.save(entry);

        return ResponseEntity.ok("User approved successfully for the tournament");
    }
}
