package com.golden_pearl.backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.DTO.TournamentDTO;
import com.golden_pearl.backend.Services.TournamentService;
import com.golden_pearl.backend.errors.ResourceNotFoundException;

import org.springframework.web.bind.annotation.RestController;

import com.golden_pearl.backend.DRO.TournamentLiveStreamLinkDRO;
import com.golden_pearl.backend.DRO.TournamentReceiveData;
import com.golden_pearl.backend.DRO.TournamentUpdateDRO;
import com.golden_pearl.backend.Models.User;
import jakarta.validation.Valid;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;

@RestController
@RequestMapping("/tournament")
@RateLimiter(name = "apiRateLimiter")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }
    @GetMapping("/allIds")
    public ResponseEntity<List<String>> getAllTournamentsIds() {
        return ResponseEntity.ok(tournamentService.getAllTournamentsIds());
    }
    @GetMapping("/all")
    public ResponseEntity<List<TournamentDTO>> getAllTournaments() {
        List<Tournament> tournaments = tournamentService.getAllTournaments();
        return ResponseEntity.ok(convertToDTOs(tournaments));
    }

    @PostMapping("/add")
    public ResponseEntity<List<TournamentDTO>> addTournament(@Valid @RequestBody TournamentReceiveData tournamentDetails) {
        Tournament readyTournament = new Tournament();
        readyTournament.setTournamentName(tournamentDetails.tournamentName());
        readyTournament.setPrizePool(tournamentDetails.prizePool());
        readyTournament.setDateTime(tournamentDetails.dateTime());
        readyTournament.setSlot(tournamentDetails.slot());
        readyTournament.setPlatform(tournamentDetails.platform());
        readyTournament.setDescription(tournamentDetails.description());
        List<Tournament> returnUpcoming = tournamentService.addTournament(readyTournament);
        return ResponseEntity.status(201).body(convertToDTOs(returnUpcoming));
    }

    // delete tournament by id
    @DeleteMapping("/delete/{tournamentIds}")
    public ResponseEntity<String> deleteTournament(@PathVariable String tournamentIds) {
        tournamentService.deleteTournamentById(tournamentIds);
        return ResponseEntity.ok("Tournament(s) deleted successfully");
    }

     // delete tournament by id
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTournaments(@RequestBody List<String> tournamentIds) {
        System.out.println("deleting tournament: " + tournamentIds.size());
        // return null;
        if (tournamentIds == null || tournamentIds.isEmpty())
            return ResponseEntity.badRequest().body("No tournament IDs provided for deletion");
        tournamentService.deleteTournamentsByIds(tournamentIds);
        return ResponseEntity.ok("Tournament(s) deleted successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<TournamentDTO> updateTournament(@Valid @RequestBody TournamentUpdateDRO tournamentDetails) {
                Tournament updatedTournament = tournamentService.updateTournament(tournamentDetails);
        return ResponseEntity.ok(convertToDTO(updatedTournament));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TournamentDTO>> getUpcomingTournaments() {
        List<Tournament> tournaments = tournamentService.getUpcomingTournaments();
        return ResponseEntity.ok(convertToDTOs(tournaments));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TournamentDTO>> getCompletedTournaments() {
        List<Tournament> tournaments = tournamentService.getCompletedTournaments();
        return ResponseEntity.ok(convertToDTOs(tournaments));
    }

    // service for the user who not login or registered
    @GetMapping("/lastTournament")
    public ResponseEntity<TournamentDTO> getLastTournaments() {
        Tournament tournament = tournamentService.getLastTournament();
        return ResponseEntity.ok(convertToDTO(tournament));
    }

    @PostMapping("/saveAll")
    public ResponseEntity<List<TournamentDTO>> saveAllTournaments(@RequestBody List<TournamentUpdateDRO> tournaments) {
        List<Tournament> savedTournaments = tournamentService.saveAllTournaments(tournaments);
        return ResponseEntity.status(201).body(convertToDTOs(savedTournaments));
    }

    // get participants of a tournament
    @GetMapping("/{tournamentId}/participants")
    public ResponseEntity<List<User>> getParticipants(@PathVariable String tournamentId) {
        return ResponseEntity.ok(null);
    }

    // get tournament by id
    @GetMapping("/{tournamentId}")
    public ResponseEntity<TournamentDTO> getTournamentById(@PathVariable String tournamentId) {
        try {
            if (tournamentId == null || tournamentId.isEmpty()||!tournamentService.existsById(tournamentId)) {
                return ResponseEntity.badRequest().build();
            }
            Tournament tournament = tournamentService.getTournamentById(tournamentId);
            return ResponseEntity.ok(convertToDTO(tournament));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // find all tournament by list
    @PostMapping("/getTournamentsByIds/{tournamentIds}")
    public ResponseEntity<List<TournamentDTO>> getTournamentsbyids(@PathVariable List<String> tournamentIds) {
        List<Tournament> tournaments = tournamentService.getTournamentsbyids(tournamentIds);
        return ResponseEntity.ok(convertToDTOs(tournaments));
    }

    //get tournament which is going to start first
    @GetMapping("/next")
    public ResponseEntity<TournamentDTO> getNextTournament() {
        Tournament tournament = tournamentService.getNextTournament();
        return ResponseEntity.ok(convertToDTO(tournament));
    }

    //set link for specific tournament
    @PutMapping("/set-live-stream-link")
    public ResponseEntity<String> setLiveStreamLink(@RequestBody TournamentLiveStreamLinkDRO tournamentLiveStreamLinkDRO) {
        if(tournamentLiveStreamLinkDRO==null || tournamentLiveStreamLinkDRO.tournamentId()==null || tournamentLiveStreamLinkDRO.tournamentId().isEmpty() || tournamentLiveStreamLinkDRO.liveStreamLink()==null || tournamentLiveStreamLinkDRO.liveStreamLink().isEmpty()){
            return ResponseEntity.badRequest().body("Invalid input: tournamentId and liveStreamLink are required");
        }
         if(tournamentService.setLiveStreamLink(tournamentLiveStreamLinkDRO)){
            return ResponseEntity.ok("Live stream link set successfully");
         };
        return ResponseEntity.status(500).body("Failed to set live stream link");
    }


    private TournamentDTO convertToDTO(Tournament tournament) {
        if (tournament == null) {
            return null;
        }
        return new TournamentDTO(
                tournament.getId(),
                tournament.getTournamentName(),
                tournament.getPrizePool(),
                tournament.getDateTime(),
                tournament.getEntryFee(),
                tournament.getSlot(),
                tournament.getPlatform(),
                tournament.getDescription());
    }

    private List<TournamentDTO> convertToDTOs(List<Tournament> tournaments) {
        return tournaments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

}
