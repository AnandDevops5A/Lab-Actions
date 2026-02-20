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
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.golden_pearl.backend.DRO.LeaderboardRegisterReceiveData;
import com.golden_pearl.backend.DTO.TournamentWithLeaderboard;
import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.LeaderboardRepository;
import com.golden_pearl.backend.errors.ResourceNotFoundException;
import com.golden_pearl.backend.common.General;

@Service
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
     private final UserService userService;
    private final TournamentService tournamentService;
    public final General general = new General();
    public final EmailService emailService;

    public LeaderboardService(LeaderboardRepository leaderboardRepository, TournamentService tournamentService,
            UserService userService, EmailService emailService) {
        this.leaderboardRepository = leaderboardRepository;
        this.tournamentService = tournamentService;
        this.userService = userService;
        this.emailService = emailService;
    }

    // register user for tournament
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "leaderboard", key = "#registerData.tournamentId"),
            @CacheEvict(value = "topNLeaderboard", allEntries = true),
            @CacheEvict(value = "userTournaments", key = "#registerData.userId"),
            @CacheEvict(value = "userTournamentsDetails", key = "#registerData.userId"),
            @CacheEvict(value = "adminData", allEntries = true),
            @CacheEvict(value = "allLeaderboards", allEntries = true)
    })
    public String registerUserForTournament(LeaderboardRegisterReceiveData registerData) {
        // 1. Fail Fast: Validate inputs immediately
        if (registerData == null || registerData.userId() == null || registerData.tournamentId() == null) {
            throw new IllegalArgumentException("Invalid registration data: Missing User ID or Tournament ID.");
        }

        // Check if user is already registered for this tournament
        LeaderBoard existingEntry = leaderboardRepository.findByTournamentIdAndUserId(registerData.tournamentId(),
                registerData.userId());

        if (existingEntry != null) {
            return "You are already registered for this tournament.";
        }

        // Check if user exists
        User user = userService.findUserById(registerData.userId());
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        // Check if tournament exists
        Tournament tournament = tournamentService.getTournamentById(registerData.tournamentId());
        if (tournament == null) {
            throw new ResourceNotFoundException("Tournament not found");
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

        return "You registered successfully for the " + tournament.getTournamentName();
    }

    // get leaderboard for a tournament
    @Cacheable(value = "leaderboard", key = "#tournamentId", sync = true)
    public List<LeaderBoard> getLeaderboard(String tournamentId) {
        // Check if tournament exists
        // Tournament tournament = tournamentRepository.findById(tournamentId)
        if (tournamentService.getTournamentById(tournamentId) == null) {
            throw new ResourceNotFoundException("Tournament not found");
        }

        return leaderboardRepository.findByTournamentIdOrderByRankAsc(tournamentId);
    }

    // get top n leaderboard for a tournament
    @Cacheable(value = "topNLeaderboard", key = "#tournamentId + '-' + #n", sync = true)
    public List<LeaderBoard> getTopNLeaderboard(String tournamentId, int n) {
        // Check if tournament exists
        // Tournament tournament = tournamentRepository.findById(tournamentId)
        if (tournamentService.getTournamentById(tournamentId) == null) {
            throw new ResourceNotFoundException("Tournament not found");
        }

        Pageable pageable = PageRequest.of(0, n);
        Page<LeaderBoard> leaderboard = leaderboardRepository.findByTournamentIdOrderByScoreDesc(tournamentId,
                pageable);
        return leaderboard.getContent();
    }

    // update rank of user
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "leaderboard", key = "#tournamentId"),
            @CacheEvict(value = "topNLeaderboard", allEntries = true),
            @CacheEvict(value = "userTournaments", key = "#userId"),
            @CacheEvict(value = "userTournamentsDetails", key = "#userId"),
            @CacheEvict(value = "adminData", allEntries = true),
            @CacheEvict(value = "allLeaderboards", allEntries = true)
    })
    public String updateRank(String tournamentId, String userId, int rank) {
        // Find the LeaderBoard entry
        LeaderBoard entry = leaderboardRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (entry == null) {
            throw new ResourceNotFoundException("User not registered for this tournament");
        }
        if (entry.getRank() != null && entry.getRank() == rank) {
            return "Rank is already up to date";
        }
        entry.setRank(rank);

        leaderboardRepository.save(entry);

        return "Rank updated successfully";
    }

    // update score of user
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "leaderboard", key = "#tournamentId"),
            @CacheEvict(value = "topNLeaderboard", allEntries = true),
            @CacheEvict(value = "userTournaments", key = "#userId"),
            @CacheEvict(value = "userTournamentsDetails", key = "#userId"),
            @CacheEvict(value = "adminData", allEntries = true),
            @CacheEvict(value = "allLeaderboards", allEntries = true)
    })
    public String updateScore(String tournamentId, String userId, int score) {
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

        return "Score updated successfully";
    }

    // get tournaments joined by a user
    @Cacheable(value = "userTournaments", key = "#userId", sync = true)
    public List<LeaderBoard> getJoinedUsersTournaments(String userId) {
        return leaderboardRepository.findByUserId(userId);
    }

    @Caching(evict = {
            @CacheEvict(value = "leaderboard", key = "#tournament.id"),
            @CacheEvict(value = "topNLeaderboard", allEntries = true),
            @CacheEvict(value = "userTournaments", allEntries = true),
            @CacheEvict(value = "userTournamentsDetails", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true),
            @CacheEvict(value = "allLeaderboards", allEntries = true)
    })
    public String registerAllUsersForTournament(Tournament tournament, List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return "No users provided for registration";
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
                .toList();

        // Save all new entries in bulk
        if (!entriesToSave.isEmpty()) {
            leaderboardRepository.saveAll(entriesToSave);
        }

        return "All users registered successfully for the tournament: " + tournament.getTournamentName();
    }

    @Cacheable(value = "leaderboardByIds", key = "#tournamentIds.toString()", sync = true)
    public List<LeaderBoard> getLeaderboardByTournamentIds(List<String> tournamentIds) {
        return leaderboardRepository.findByTournamentIdIn(tournamentIds);
    }

 
    @Caching(evict = {
            @CacheEvict(value = "leaderboard", key = "#tournamentId"),
            @CacheEvict(value = "topNLeaderboard", allEntries = true),
            @CacheEvict(value = "userTournaments", key = "#userId"),
            @CacheEvict(value = "userTournamentsDetails", key = "#userId"),
            @CacheEvict(value = "adminData", allEntries = true),
            @CacheEvict(value = "allLeaderboards", allEntries = true)
    })
    public String approveUserFromTournament(String tournamentId, String userId) {
        // Find the LeaderBoard entry
        LeaderBoard entry = leaderboardRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (entry == null) {
            throw new ResourceNotFoundException("User not registered for this tournament");
        }
        if (entry.getIsApproved()) {
            return "User is already approved for this tournament";
        }
        entry.setIsApproved(true);

        leaderboardRepository.save(entry);

        return "User approved successfully for the tournament";
    }

    // get tournament list by user id with rank and invest amount
    @Cacheable(value = "userTournamentsDetails", key = "#userId", sync = true)
    public List<TournamentWithLeaderboard> getTournamentsByUserId(String userId) {
        return (leaderboardRepository.findTournamentsByUserIdWithDetails(userId));
    }

    // Update leaderboard entry (rank, investAmount and winAmount) - partial updates
    // allowed

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "leaderboard", allEntries = true),
            @CacheEvict(value = "topNLeaderboard", allEntries = true),
            @CacheEvict(value = "userTournaments", allEntries = true),
            @CacheEvict(value = "userTournamentsDetails", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true),
            @CacheEvict(value = "allLeaderboards", allEntries = true)
    })
    public String updateLeaderboardEntry(String leaderboardId, Integer rank, Integer investAmount,
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

        return "Leaderboard entry updated successfully";
    }

    // Approve leaderboard entry
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "leaderboard", allEntries = true),
            @CacheEvict(value = "topNLeaderboard", allEntries = true),
            @CacheEvict(value = "userTournaments", allEntries = true),
            @CacheEvict(value = "userTournamentsDetails", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true),
            @CacheEvict(value = "allLeaderboards", allEntries = true)
    })
    public String approveLeaderboardEntry(String leaderboardId) {
        // Find the LeaderBoard entry
        if (leaderboardId == null) {
            throw new IllegalArgumentException("Leaderboard ID is required");
        }
        LeaderBoard entry = leaderboardRepository.findById(leaderboardId)
                .orElseThrow(() -> new ResourceNotFoundException("Leaderboard entry not found"));

        if (entry.getIsApproved()) {
            return "Entry is already approved";
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

        return "Leaderboard entry approved successfully";
    }

    @Cacheable(value = "allLeaderboards", sync = true)
    public List<LeaderBoard> getAllLeaderboard() {
        return leaderboardRepository.findAll();
    }

}