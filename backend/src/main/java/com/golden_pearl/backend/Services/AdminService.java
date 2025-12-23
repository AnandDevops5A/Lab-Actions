package com.golden_pearl.backend.Services;

import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
        response.put("users", userRepository.findAll());
        response.put("tournaments", tournamentRepository.findAll());
        return response;
    }
}