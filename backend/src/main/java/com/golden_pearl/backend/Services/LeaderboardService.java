package com.golden_pearl.backend.Services;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.data.domain.PageRequest;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.golden_pearl.backend.DRO.LeaderboardRegisterReceiveData;
import com.golden_pearl.backend.DTO.TournamentWithLeaderboard;
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
    public final EmailService emailService;

    public LeaderboardService(LeaderboardRepository leaderboardRepository, UserRepository userRepository,
            TournamentRepository tournamentRepository, TournamentService tournamentService, EmailService emailService) {
        this.leaderboardRepository = leaderboardRepository;
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
        this.tournamentService = tournamentService;
        this.emailService = emailService;
    }

    // register user for tournament
    @Transactional
    public ResponseEntity<String> registerUserForTournament(LeaderboardRegisterReceiveData registerData) {
        // 1. Fail Fast: Validate inputs immediately
        if (registerData == null || registerData.userId() == null || registerData.tournamentId() == null) {
            return ResponseEntity.badRequest().body("Invalid registration data: Missing User ID or Tournament ID.");
        }

        // Check if user is already registered for this tournament
        LeaderBoard existingEntry = leaderboardRepository.findByTournamentIdAndUserId(registerData.tournamentId(),
                registerData.userId());

        if (existingEntry != null) {
            return ResponseEntity.badRequest().body("You are already registered for this tournament.");
        }

        // Check if user exists
        User user = userRepository.findById(registerData.userId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Check if tournament exists
        Tournament tournament = tournamentRepository.findById(registerData.tournamentId()).orElse(null);
        if (tournament == null) {
            return ResponseEntity.status(404).body("Tournament not found");
        }

        // 2. Use Builder Pattern for cleaner object creation
        LeaderBoard newEntry = LeaderBoard.builder()
                .userId(registerData.userId())
                .tournamentId(registerData.tournamentId())
                .tempEmail(registerData.tempEmail())
                .transactionId(registerData.transactionId())
                .gameId(registerData.gameId())
                .time(general.getCurrentTime())
                .isApproved(false) // Explicitly set default state if needed
                .build();

        leaderboardRepository.save(newEntry);

        // 3. Send email (Async) - Using the renamed variable
        try {
            emailService.sendJoinEmail(newEntry.getTempEmail(), user, tournament, newEntry);
        } catch (Exception e) {
            // Log error but do not fail the registration transaction just because email
            // failed
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }

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
        // System.out.println("Leaderboard entries found: " + leaderboard.size());
        return ResponseEntity.ok(leaderboard);
    }

    // Seed leaderboard with fake/sample data for a tournament
    @Transactional
    public ResponseEntity<String> seedLeaderboard(List<String> listOfUserIds, String tournamentId, int count) {
        // 1. Validations & Bounds
        if (listOfUserIds == null || listOfUserIds.isEmpty())
            return ResponseEntity.badRequest().body("Empty user list");

        // Senior move: Ensure we never exceed our unique amount pool (1-50)
        int seedLimit = Math.min(count, Math.min(listOfUserIds.size(), 50));

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found"));

        // 2. Data Preparation
        List<String> shuffledUsers = new ArrayList<>(listOfUserIds);
        Collections.shuffle(shuffledUsers);

        List<Integer> amountPool = IntStream.rangeClosed(1, 50).boxed().collect(Collectors.toList());
        Collections.shuffle(amountPool);

        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        List<LeaderBoard> entries = new ArrayList<>();

        // Move time calculation OUTSIDE the loop unless you want different minutes per
        // entry
        int timeAsInt = (LocalTime.now().getHour() * 100) + LocalTime.now().getMinute();

        // 3. Generation
        for (int i = 0; i < seedLimit; i++) {
            String userId = shuffledUsers.get(i);
            String shortId = tournamentId.substring(Math.max(0, tournamentId.length() - 4));
            String gameId = String.format("G-%s-%03d", shortId, i + 1);

            entries.add(LeaderBoard.builder()
                    .tournamentId(tournamentId)
                    .userId(userId)
                    .gameId(gameId)
                    .tempEmail(userId + "@example.com")
                    .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8))
                    .score(rnd.nextInt(1, 100))
                    .investAmount(amountPool.get(i))
                    .time(timeAsInt)
                    .isApproved(true)
                    .build());
        }

        // 4. Ranking & Prize Distribution
        entries.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));

        for (int i = 0; i < entries.size(); i++) {
            LeaderBoard entry = entries.get(i);
            entry.setRank(i + 1);

            // Fixed indexing: i=0 is 1st place
            switch (i) {
                case 0 -> entry.setWinAmount(500); // 1st Place
                case 1 -> entry.setWinAmount(300); // 2nd Place
                case 2 -> entry.setWinAmount(100); // 3rd Place
                default -> entry.setWinAmount(0);
            }
        }

        // 5. Save
        leaderboardRepository.saveAll(entries);
        return ResponseEntity
                .ok(String.format("Seeded %d entries for %s", entries.size(), tournament.getTournamentName()));
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

    // get tournament list by user id with rank and invest amount
    public ResponseEntity<List<TournamentWithLeaderboard>> getTournamentsByUserId(String userId) {
        return ResponseEntity.ok(leaderboardRepository.findTournamentsByUserIdWithDetails(userId));
    }

    // Update leaderboard entry (rank, investAmount and winAmount) - partial updates
    // allowed

    @Transactional
    @CacheEvict(value = "adminData", allEntries = true)
    public ResponseEntity<String> updateLeaderboardEntry(String leaderboardId, Integer rank, Integer investAmount,
            Integer winAmount) {
        // Find the LeaderBoard entry
        LeaderBoard entry = leaderboardRepository.findById(leaderboardId)
                .orElseThrow(() -> new ResourceNotFoundException("Leaderboard entry not found"));

        // Update only the provided fields
        LeaderBoard updatedEntry = LeaderBoard.builder()
                .id(entry.getId())
                .userId(entry.getUserId())
                .tournamentId(entry.getTournamentId())
                .tempEmail(entry.getTempEmail())
                .transactionId(entry.getTransactionId())
                .investAmount(investAmount != null ? investAmount : entry.getInvestAmount())
                .winAmount(winAmount != null ? winAmount : entry.getWinAmount())
                .rank(rank != null ? rank : entry.getRank())
                .time(entry.getTime())
                .score(entry.getScore())
                .isApproved(entry.getIsApproved())
                .build();

        leaderboardRepository.save(updatedEntry);

        return ResponseEntity.ok("Leaderboard entry updated successfully");
    }

    // Approve leaderboard entry
    @Transactional
    public ResponseEntity<String> approveLeaderboardEntry(String leaderboardId) {
        // Find the LeaderBoard entry
        LeaderBoard entry = leaderboardRepository.findById(leaderboardId)
                .orElseThrow(() -> new ResourceNotFoundException("Leaderboard entry not found"));

        if (entry.getIsApproved()) {
            return ResponseEntity.ok("Entry is already approved");
        }

        // Update the entry
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
                .score(entry.getScore())
                .isApproved(true)
                .build();

        leaderboardRepository.save(updatedEntry);

        return ResponseEntity.ok("Leaderboard entry approved successfully");
    }

    public List<LeaderBoard> getAllLeaderboard() {
        return leaderboardRepository.findAll();
    }

}