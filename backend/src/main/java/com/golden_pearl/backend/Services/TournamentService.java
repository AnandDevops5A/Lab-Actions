package com.golden_pearl.backend.Services;

import java.util.ArrayList;
import java.util.HashMap;

import com.golden_pearl.backend.common.General;

import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.Repository.UserRepository;
import com.golden_pearl.backend.errors.ResourceNotFoundException;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final UserService UserService;
    private final UserRepository userRepository;
    private final General general = new General();

    // constructor
    public TournamentService(TournamentRepository tournamentRepository, UserService UserService,
            UserRepository userRepository) {
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
        this.UserService = UserService;

    }

    // get current dateTime in yyyyMMddHHmm format

    // get all tournaments
    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    // add tournament
    @CacheEvict(value = "adminData", allEntries = true)
    public Tournament addTournament(Tournament tournamentDetails) {
        // The startDateTime should be set in the request body by the client
        if (tournamentDetails == null)
            return null;
        tournamentDetails.setDateTime(general.getCurrentDateTime());
        return tournamentRepository.save(tournamentDetails);
    }

    // get tournament by id
    public Tournament getTournamentById(String id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }

    // delete tournament by id
    @CacheEvict(value = "adminData", allEntries = true)
    public void deleteTournamentById(String id) {
        tournamentRepository.deleteById(id);
    }

    // update tournament by id
    @CacheEvict(value = "adminData", allEntries = true)
    public Tournament updateTournament(Tournament tournamentDetails) {
        if (tournamentDetails == null)
            return null;
        Tournament existingTournament = getTournamentById(tournamentDetails.getId());
        existingTournament.setTournamentName(tournamentDetails.getTournamentName());
        existingTournament.setPrizePool(tournamentDetails.getPrizePool());
        existingTournament.setDateTime(tournamentDetails.getDateTime());
        existingTournament.setEntryFee(tournamentDetails.getEntryFee());
        existingTournament.setPlatform(tournamentDetails.getPlatform());
        existingTournament.setDescription(tournamentDetails.getDescription());
        existingTournament.setRankList(tournamentDetails.getRankList());
        
        return tournamentRepository.save(existingTournament);
    }

    // get completed tournaments
    public List<Tournament> getCompletedTournaments() {
        return tournamentRepository.findByDateTimeLessThan(general.getCurrentDateTime());
    }

    // get upcoming tournaments
    public List<Tournament> getUpcomingTournaments() {
        return tournamentRepository.findByDateTimeGreaterThan(general.getCurrentDateTime());
    }

    // get last tournament
    public Tournament getLastTournament() {
        return tournamentRepository.findFirstByDateTimeLessThan(general.getCurrentDateTime());
    }

    // save all tournaments
    @CacheEvict(value = "adminData", allEntries = true)
    public List<Tournament> saveAllTournaments(List<Tournament> tournaments) {
        if (tournaments == null || tournaments.isEmpty()) {
            throw new IllegalArgumentException("Tournament list cannot be null or empty");
        }
        return tournamentRepository.saveAll(tournaments);
    }

    // register user for a tournament
    // @CacheEvict(value = "adminData", allEntries = true)
    public String registerUserForTournament(String tournamentId, String userId) {
        User user = UserService.findUserById(userId);
        Tournament tournament = getTournamentById(tournamentId);
        if (user == null || tournament == null) {
            return "User or tournament not found";
        }
        // Add tournament to user's played tournaments
        List<String> playedTournaments = user.getPlayedTournaments();
        if (playedTournaments == null) {
            playedTournaments = new ArrayList<>();
        }
        if (playedTournaments.contains(tournamentId)) {
            return user.getUsername() + ", You are already registered for " + tournament.getTournamentName();
        }
        playedTournaments.add(tournamentId);
        user.setPlayedTournaments(playedTournaments);
        userRepository.save(user);

        // join participants by add user in hashmap
        HashMap<String, Integer> existingRankList = tournament.getRankList();
        if (existingRankList == null)
            existingRankList = new HashMap<String, Integer>();
        existingRankList.put(user.getId(), 0);
        tournament.setRankList(existingRankList);
        tournamentRepository.save(tournament);

        return user.getUsername() + " registered successfully for tournament";

    }

    // get registered-userId for tournament
    public ResponseEntity<?> getRegisterdUserForTournament(String tournamentId) {
        Tournament tournament = getTournamentById(tournamentId);
        if (tournament == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        HashMap<String, Integer> rankList = tournament.getRankList();

        if (rankList == null || rankList.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

        // // sort ranklist by rank(values)
        List<String> sortedByRank = general.sortedByRank(rankList);
        // System.out.println(sortedByRank);
        List<User> users = userRepository.findAllById(rankList.keySet());
        List<User> sortedUsers = general.sortUserByRank(users, sortedByRank);
        // System.out.println(sortedUsers);

        return ResponseEntity.ok(general.convertUserToResponseUserData(sortedUsers));
    }

    // update rank of registered user
    public ResponseEntity<String> updateRank(String tournamentId, String userId, int rank) {
        Tournament tournament = getTournamentById(tournamentId);
        User user = UserService.findUserById(userId);
        if (user == null || tournament == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found..");
        HashMap<String, Integer> rankList = tournament.getRankList();
        if (!rankList.containsKey(userId))
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(user.getUsername() + " is not registerd for " + tournament.getTournamentName());

        rankList.put(userId, rank);
        tournament.setRankList(rankList);
        tournamentRepository.save(tournament);
        return ResponseEntity.ok(user.getUsername() + " ranked updated to " + rankList.get(userId));

    }

    //tempory for testing
    public Tournament settemprank(String id, HashMap<String ,Integer> ranklist ){
        Tournament t=getTournamentById(id);
       t.setRankList(ranklist);
       
      
        return addTournament(t);
    }

    public List<Tournament> getTournamentsbyids(List<String> tournamentIds) {
        return tournamentRepository.findAllById(tournamentIds);
    }

}

