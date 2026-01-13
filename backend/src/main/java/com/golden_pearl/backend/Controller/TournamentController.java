package com.golden_pearl.backend.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Services.TournamentService;
import org.springframework.web.bind.annotation.RestController;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/tournament")
public class TournamentController {

    private final TournamentService tournamentService;


    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @RequestMapping(path = "/all", method = RequestMethod.GET)
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    public ResponseEntity<Tournament> addTournament(@RequestBody Tournament tournamentDetails) {
        Tournament savedTournament = tournamentService.addTournament(tournamentDetails);
        return ResponseEntity.status(201).body(savedTournament);
    }

    @RequestMapping(path = "/update", method = RequestMethod.PUT)
    public ResponseEntity<Tournament> updateTournament(@RequestBody Tournament tournamentDetails) {
        Tournament updatedTournament = tournamentService.updateTournament(tournamentDetails);
        return ResponseEntity.ok(updatedTournament);
    }


    @RequestMapping(path = "/upcoming", method = RequestMethod.GET)
    public ResponseEntity<List<Tournament>> getUpcomingTournaments() {

        return ResponseEntity.ok(tournamentService.getUpcomingTournaments());
    }

    @RequestMapping(path = "/completed", method = RequestMethod.GET)
    public ResponseEntity<List<Tournament>> getCompletedTournaments() {

        return ResponseEntity.ok(tournamentService.getCompletedTournaments());
    }

    // service for the user who not login or registered
    @RequestMapping(path = "/lastTournament", method = RequestMethod.GET)
    public ResponseEntity<Tournament> getLastTournaments() {

        return ResponseEntity.ok(tournamentService.getLastTournament());
    }

    @RequestMapping(path = "/saveAll", method = RequestMethod.POST)
    public ResponseEntity<List<Tournament>> saveAllTournaments(@RequestBody List<Tournament> tournaments) {
        List<Tournament> savedTournaments = tournamentService.saveAllTournaments(tournaments);
        return ResponseEntity.status(201).body(savedTournaments);
    }

    // get participants of a tournament
    @GetMapping("/{tournamentId}/participants")
    public ResponseEntity<List<User>> getParticipants(@PathVariable String tournamentId) {
        return ResponseEntity.ok(null);
    }

    // get tournament by id
    @GetMapping("/{tournamentId}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable String tournamentId) {
        return ResponseEntity.ok(tournamentService.getTournamentById(tournamentId));
    }

    
    // register user for a tournament
    @PostMapping("/register/{tournamentId}/user/{userId}")
    public String registerUserForTournament(@PathVariable String tournamentId, @PathVariable String userId) {
        return tournamentService.registerUserForTournament(tournamentId, userId);
        
    }

}
