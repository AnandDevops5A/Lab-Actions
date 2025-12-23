package com.golden_pearl.backend.Services;

import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;

    public AdminService(UserRepository userRepository, TournamentRepository tournamentRepository) {
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
    }

    @Cacheable(value = "adminData")
    public Map<String, Object> getAllData() {
        Map<String, Object> response = new HashMap<>();

        CompletableFuture<?> usersFuture = CompletableFuture.supplyAsync(userRepository::findAll);
        CompletableFuture<?> tournamentsFuture = CompletableFuture.supplyAsync(tournamentRepository::findAll);

        CompletableFuture.allOf(usersFuture, tournamentsFuture).join();

        try {
            response.put("users", usersFuture.get());
            response.put("tournaments", tournamentsFuture.get());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching admin data", e);
        }
        return response;
    }
}