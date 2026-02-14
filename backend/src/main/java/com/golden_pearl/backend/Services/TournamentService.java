package com.golden_pearl.backend.Services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.common.General;
import com.golden_pearl.backend.errors.ResourceNotFoundException;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final General general = new General();

    // constructor
    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    // get all tournaments
    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    // add tournament
    @CacheEvict(value = "adminData", allEntries = true)
    public List<Tournament> addTournament(Tournament tournamentDetails) {
        // The startDateTime should be set in the request body by the client
        if (tournamentDetails == null)
            return null;
        // tournamentDetails.setDateTime(general.getCurrentDateTime());
        Tournament t= tournamentRepository.save(tournamentDetails);
        if(t!=null) {
            return getUpcomingTournaments();
        }
        return null;
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
        // System.out.println("Tournament deleted successfully");
    }

    // update tournament by id
    @CacheEvict(value = "adminData", allEntries = true)
    public Tournament updateTournament(Tournament tournamentDetails) {
        if (tournamentDetails == null)
            return null;
        Tournament existingTournament = getTournamentById(tournamentDetails.getId());
        if (existingTournament == null)
            return null;
        existingTournament.setTournamentName(tournamentDetails.getTournamentName());
        existingTournament.setPrizePool(tournamentDetails.getPrizePool());
        existingTournament.setDateTime(tournamentDetails.getDateTime());
        existingTournament.setPlatform(tournamentDetails.getPlatform());
        existingTournament.setDescription(tournamentDetails.getDescription());
       existingTournament.setSlot(tournamentDetails.getSlot());
       

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

    public List<Tournament> getTournamentsbyids(List<String> tournamentIds) {
        return tournamentRepository.findAllById(tournamentIds);
    }

}
