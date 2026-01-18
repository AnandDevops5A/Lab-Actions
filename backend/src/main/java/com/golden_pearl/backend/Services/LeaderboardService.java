package com.golden_pearl.backend.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.golden_pearl.backend.Models.LeaderBoard;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.LeaderBoardRepository;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;

@Service
public class LeaderboardService {

    private final LeaderBoardRepository leaderboardRepository;
    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;

    public LeaderboardService(LeaderBoardRepository leaderboardRepository, UserRepository userRepository,
            TournamentRepository tournamentRepository) {
        this.leaderboardRepository = leaderboardRepository;
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
    }
    

   
}
