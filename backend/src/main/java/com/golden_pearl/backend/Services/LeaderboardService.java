package com.golden_pearl.backend.Services;

import java.util.ArrayList;
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
public class LeaderBoardService {

    private final LeaderBoardRepository leaderBoardRepository;
    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;

    public LeaderBoardService(LeaderBoardRepository leaderBoardRepository, UserRepository userRepository, TournamentRepository tournamentRepository) {
        this.leaderBoardRepository = leaderBoardRepository;
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
    }

    //get all leaderboard entries
    public ResponseEntity<Page<LeaderBoard>> getAllLeaderBoard(Pageable pageable) {
        return ResponseEntity.ok(leaderBoardRepository.findAll(pageable));
    }

    //register user for tournament
    @Transactional
    public ResponseEntity<String> registerUserForTournament(String tournamentId, String userId) {
        LeaderBoard existingEntry = leaderBoardRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (existingEntry != null) {
            return ResponseEntity.ok("User already registered for this tournament");
        }
        try {
            
        

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Tournament tournament = tournamentRepository.findById(tournamentId).orElseThrow(() -> new RuntimeException("Tournament not found"));

        List<Tournament> playedTournaments = user.getPlayedTournaments();
        if (playedTournaments == null) {
            playedTournaments = new ArrayList<>();
        }
        playedTournaments.add(tournament);
        user.setPlayedTournaments(playedTournaments);
        userRepository.save(user);

        List<User> participantsList = tournament.getParticipantsList();
        if (participantsList == null) {
            participantsList = new ArrayList<>();
        }
        participantsList.add(user);
        tournament.setParticipantsList(participantsList);
        tournament.setParticipants(participantsList.size());
        tournamentRepository.save(tournament);

        LeaderBoard leaderBoard = new LeaderBoard();
        leaderBoard.setTournament(tournament);
        leaderBoard.setUser(user);
        leaderBoard.setScore(0);
        leaderBoard.setRank(0);
        // Initially rank is set to 0, it will be updated when scores are updated
        leaderBoard = leaderBoardRepository.save(leaderBoard);
        if (leaderBoard == null) {
            return ResponseEntity.internalServerError().body("Failed to register user for tournament");
        }
        return ResponseEntity.ok("User registered successfully");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }



    //get leaderboard by tournament id
    public ResponseEntity<Page<LeaderBoard>> getLeaderBoardByTournamentId(String tournamentId, Pageable pageable) {
        //it will return all leaderboard entries of a tournament
        return ResponseEntity.ok(leaderBoardRepository.findByTournamentIdOrderByScoreDesc(tournamentId, pageable));
    }

    //get leaderboard by user id
    public ResponseEntity<List<LeaderBoard>> getLeaderBoardByUserId(String userId) {
        //it will return all leaderboard entries of a user
        return ResponseEntity.ok(leaderBoardRepository.findByUserId(userId));
    }

    //get top n leaderboard entries by tournament id
    public ResponseEntity<List<LeaderBoard>> getTopNLeaderBoardByTournamentId(String tournamentId, int n) {
        Pageable pageable = PageRequest.of(0, n);
        //it will return top n leaderboard entries of a tournament
        return ResponseEntity.ok(leaderBoardRepository.findByTournamentIdOrderByRankAsc(tournamentId, pageable));
    }

    // Update score for a user in a tournament
    @Transactional
    public ResponseEntity<LeaderBoard> updateScore(String tournamentId, String userId, int score) {
        LeaderBoard leaderBoard = leaderBoardRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (leaderBoard == null) {
            return ResponseEntity.notFound().build();
        }
        leaderBoard.setScore(score);
        leaderBoardRepository.save(leaderBoard);

        // Recalculate ranks for the entire tournament.
        // For very large leaderboards, this should be done asynchronously.
        recalculateRanks(tournamentId);

        // Re-fetch the entity to return the updated rank
        return ResponseEntity.ok(leaderBoardRepository.findByTournamentIdAndUserId(tournamentId, userId));
    }

    private void recalculateRanks(String tournamentId) {
        // Fetch all entries for the tournament, sorted by score descending
        List<LeaderBoard> rankedList = leaderBoardRepository.findByTournamentIdOrderByScoreDesc(tournamentId);

        for (int i = 0; i < rankedList.size(); i++) {
            rankedList.get(i).setRank(i + 1);
        }

        // Bulk save the updated ranks
        leaderBoardRepository.saveAll(rankedList);
    }

    
}
