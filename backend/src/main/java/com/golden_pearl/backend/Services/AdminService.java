package com.golden_pearl.backend.Services;

import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.LeaderboardRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private final LeaderboardRepository leaderBoardRepository;
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
    // 1. Define a specific thread pool (bean) to avoid common pool issues
    private final Executor executor = Executors.newFixedThreadPool(10);
    public AdminService(UserRepository userRepository, TournamentRepository tournamentRepository, LeaderboardRepository leaderBoardRepository) {
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
        this.leaderBoardRepository = leaderBoardRepository;
    }

    @Cacheable(value = "adminData", sync = true)
    public Map<String, Object> getAllData() {
    logger.info("Database hit for admin database");

    // 2. Use specific types instead of wildcards
    CompletableFuture<List<User>> usersFuture = CompletableFuture.supplyAsync(userRepository::findAll, executor);
    CompletableFuture<List<Tournament>> tournamentsFuture = CompletableFuture.supplyAsync(tournamentRepository::findAll, executor);
    CompletableFuture<List<LeaderBoard>> leaderboardFuture = CompletableFuture.supplyAsync(leaderBoardRepository::findAll, executor);

    // 3. Combine and handle results cleanly
    return CompletableFuture.allOf(usersFuture, tournamentsFuture, leaderboardFuture)
        .thenApply(v -> {
            Map<String, Object> response = new HashMap<>();
            response.put("users", usersFuture.join());
            response.put("tournaments", tournamentsFuture.join());
            response.put("leaderboard", leaderboardFuture.join());
            return response;
        })
        .exceptionally(ex -> {
            logger.error("Error fetching admin data: {}", ex.getMessage());
            return Collections.emptyMap(); // Or handle error accordingly
        })
        .join();
}
}