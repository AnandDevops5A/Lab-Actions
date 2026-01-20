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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

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

    @RequestMapping(path = "/all", method = RequestMethod.POST)
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    public ResponseEntity<Tournament> addTournament(@RequestBody TournamentReceiveData tournamentDetails) {
       Tournament readyTournament = new Tournament();
        readyTournament.setTournamentName(tournamentDetails.tournamentName());
        readyTournament.setPrizePool(tournamentDetails.prizePool());
        readyTournament.setDateTime(tournamentDetails.dateTime());
        readyTournament.setSlot(tournamentDetails.slot());
        readyTournament.setPlatform(tournamentDetails.platform());
        readyTournament.setDescription(tournamentDetails.description());
        Tournament savedTournament = tournamentService.addTournament(readyTournament);
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

    //
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

    // get all register userid for tournament
    @PostMapping("/getUsers/{tournamentId}")
    public ResponseEntity<?> getAllRegisteredUsers(@PathVariable String tournamentId) {
        return tournamentService.getRegisterdUserForTournament(tournamentId);
    }

    // update rank of user
    @PostMapping("/updateRank/{tId}/{uId}/{rank}")
    public ResponseEntity<String> updateRank(@PathVariable String tId, @PathVariable String uId,
            @PathVariable int rank) {
        return tournamentService.updateRank(tId, uId, rank);
    }

    //find all tournament by list 
    @PostMapping("/getTournament")
    public List<Tournament> getTournamentsbyids(@RequestBody List<String> tournamentIds){
        System.out.println(tournamentIds);
        return tournamentService.getTournamentsbyids(tournamentIds);
        // return null;
    }

    //tempory just for testing
    @PostMapping("/temprankset/{tid}")
    public Tournament settemprank(@RequestBody HashMap<String, Integer> rankList,
            @PathVariable String tid) {
        return tournamentService.settemprank(tid, rankList);
    }

}
