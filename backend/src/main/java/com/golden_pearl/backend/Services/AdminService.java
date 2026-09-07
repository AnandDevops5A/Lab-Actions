package com.golden_pearl.backend.services;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executor;

import com.golden_pearl.backend.DTO.LeaderBoardDTO;
import com.golden_pearl.backend.DTO.TournamentDTO;
import com.golden_pearl.backend.DTO.UserDTO;

@Service
@Lazy
public class AdminService {

    private final UserService userService;
    private final TournamentService tournamentService;
    private final LeaderboardService leaderBoardService;
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
    private final Executor executor;

    public AdminService(UserService userService, TournamentService tournamentService,
            LeaderboardService leaderBoardService, @Qualifier("taskExecutor") Executor executor) {
        this.userService = userService;
        this.tournamentService = tournamentService;
        this.leaderBoardService = leaderBoardService;
        this.executor = executor;
    }

    @Cacheable(value = "adminData", sync = true)
    public Map<String, Object> getAllData() {
        logger.info("Fetching admin data from the database");

        CompletableFuture<List<UserDTO>> usersFuture = CompletableFuture.supplyAsync(
                userService::findAll, executor);
        CompletableFuture<List<TournamentDTO>> tournamentsFuture = CompletableFuture.supplyAsync(
                tournamentService::getAllTournamentsSortedByDateTime, executor);
        CompletableFuture<List<LeaderBoardDTO>> leaderboardFuture = CompletableFuture.supplyAsync(
                leaderBoardService::getAllLeaderboard, executor);

        try {
            CompletableFuture.allOf(usersFuture, tournamentsFuture, leaderboardFuture).join();

            Map<String, Object> response = new HashMap<>(3);
            response.put("users", usersFuture.join());
            response.put("tournaments", tournamentsFuture.join());
            response.put("leaderboard", leaderboardFuture.join());
            return response;
        } catch (CompletionException exception) {
            Throwable cause = exception.getCause() == null ? exception : exception.getCause();
            logger.error("Failed to fetch admin data", cause);
            throw new IllegalStateException("Unable to fetch admin data", cause);
        }
    }
}