package com.golden_pearl.backend.Services;

import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import com.golden_pearl.backend.Repository.LeaderboardRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private final LeaderboardRepository leaderBoardRepository;


    public AdminService(UserRepository userRepository, TournamentRepository tournamentRepository, LeaderboardRepository leaderBoardRepository) {
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
        this.leaderBoardRepository = leaderBoardRepository;
    }

    @Cacheable(value = "adminData")
    public Map<String, Object> getAllData() {
        Map<String, Object> response = new HashMap<>();
        System.out.println("Database hit for admin database");

        CompletableFuture<?> usersFuture = CompletableFuture.supplyAsync(userRepository::findAll);
        CompletableFuture<?> tournamentsFuture = CompletableFuture.supplyAsync(tournamentRepository::findAll);
        CompletableFuture<?> leaderboardFuture = CompletableFuture.supplyAsync(leaderBoardRepository::findAll);

        CompletableFuture.allOf(usersFuture, tournamentsFuture, leaderboardFuture).join();

        try {
            response.put("users", usersFuture.get());
            response.put("tournaments", tournamentsFuture.get());
            response.put("leaderboard", leaderboardFuture.get());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching admin data", e);
        }
        return response;
    }
}