package com.golden_pearl.backend.Controller;

/**
 * TournamentController handles all tournament-related operations including
 * creating, updating, retrieving tournaments, and managing user registrations.
 * This controller provides REST endpoints for tournament management in the
 * Golden Pearl backend application.
 */

import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Services.TournamentService;

import org.springframework.web.bind.annotation.RestController;

import com.golden_pearl.backend.DRO.TournamentReceiveData;
import com.golden_pearl.backend.Models.User;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/tournament")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

@GetMapping("/all")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @PostMapping("/add")
    public ResponseEntity<List<Tournament>> addTournament(@RequestBody TournamentReceiveData tournamentDetails) {
        Tournament readyTournament = new Tournament();
        readyTournament.setTournamentName(tournamentDetails.tournamentName());
        readyTournament.setPrizePool(tournamentDetails.prizePool());
        readyTournament.setDateTime(tournamentDetails.dateTime());
        readyTournament.setSlot(tournamentDetails.slot());
        readyTournament.setPlatform(tournamentDetails.platform());
        readyTournament.setDescription(tournamentDetails.description());
        List<Tournament> returnUpcoming = tournamentService.addTournament(readyTournament);
        return ResponseEntity.status(201).body(returnUpcoming);
    }

    // delete tournament by id
    @DeleteMapping("/delete/{tournamentId}")
    public ResponseEntity<String> deleteTournament(@PathVariable String tournamentId) {
        tournamentService.deleteTournamentById(tournamentId);
        return ResponseEntity.ok("Tournament deleted successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<Tournament> updateTournament(@RequestBody Tournament tournamentDetails) {
        Tournament updatedTournament = tournamentService.updateTournament(tournamentDetails);
        return ResponseEntity.ok(updatedTournament);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Tournament>> getUpcomingTournaments() {
        return ResponseEntity.ok(tournamentService.getUpcomingTournaments());
    }

    @GetMapping("/completed")
    public ResponseEntity<List<Tournament>> getCompletedTournaments() {
        return ResponseEntity.ok(tournamentService.getCompletedTournaments());
    }

    // service for the user who not login or registered
    @GetMapping("/lastTournament")
    public ResponseEntity<Tournament> getLastTournaments() {

        return ResponseEntity.ok(tournamentService.getLastTournament());
    }

    @PostMapping("/saveAll")
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

    // find all tournament by list
    @PostMapping("/getTournamentsByIds/{tournamentIds}")
    public List<Tournament> getTournamentsbyids(@PathVariable List<String> tournamentIds) {
        return tournamentService.getTournamentsbyids(tournamentIds);
    }

}
