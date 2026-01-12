package com.golden_pearl.backend.Services;

import com.golden_pearl.backend.common.General;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Models.User;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.errors.ResourceNotFoundException;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final General general = new General();

    // constructor
    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;

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
    public Tournament updateTournament(String id, Tournament tournamentDetails) {

        Tournament existingTournament = getTournamentById(id);
        existingTournament.setTournamentName(tournamentDetails.getTournamentName());
        existingTournament.setPrizePool(tournamentDetails.getPrizePool());
        existingTournament.setDateTime(tournamentDetails.getDateTime());
        existingTournament.setEntryFee(tournamentDetails.getEntryFee());
        existingTournament.setPlatform(tournamentDetails.getPlatform());
        existingTournament.setParticipants(tournamentDetails.getParticipants());
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

    // get participants list
    public List<User> getParticipants(String tournamentId) {
        return getTournamentById(tournamentId).getParticipantsList();
    }
}
