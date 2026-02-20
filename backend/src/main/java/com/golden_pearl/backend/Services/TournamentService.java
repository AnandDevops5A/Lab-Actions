package com.golden_pearl.backend.Services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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

    @Cacheable(value = "tournaments", sync = true)
    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    // add tournament
    @Caching(evict = {
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
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
    @Cacheable(value = "tournament", key = "#id",sync = true)
    public Tournament getTournamentById(String id) {
        System.out.println("Fetching tournament with id: " );
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }

    // delete tournament by id
    @Caching(evict = {
            @CacheEvict(value = "tournament", key = "#id" ),
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "completedTournaments", allEntries = true),
            @CacheEvict(value = "lastTournament", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public void deleteTournamentById(String id) {
        if (id == null)
            return;
        tournamentRepository.deleteById(id);
        // System.out.println("Tournament deleted successfully");
    }

    // update tournament by id
    @Caching(put = { @CachePut(value = "tournament", key = "#tournamentDetails.id") },
     evict = {
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "lastTournament", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
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
    @Cacheable(value = "completedTournaments", sync = true)
    public List<Tournament> getCompletedTournaments() {
        return tournamentRepository.findByDateTimeLessThan(general.getCurrentDateTime());
    }

    // get upcoming tournaments
    @Cacheable(value = "upcomingTournaments", sync = true)
    public List<Tournament> getUpcomingTournaments() {
        return tournamentRepository.findByDateTimeGreaterThan(general.getCurrentDateTime());
    }

    // get last tournament
    @Cacheable(value = "lastTournament", sync = true)
    public Tournament getLastTournament() {
        return tournamentRepository.findFirstByDateTimeLessThan(general.getCurrentDateTime());
    }

    // save all tournaments
    @Caching(evict = {
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),           
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public List<Tournament> saveAllTournaments(List<Tournament> tournaments) {
        if (tournaments == null || tournaments.isEmpty()) {
            throw new IllegalArgumentException("Tournament list cannot be null or empty");
        }
        return tournamentRepository.saveAll(tournaments);
    }

    // register user for a tournament

    @Cacheable(value = "tournamentsByIds", sync = true)
    public List<Tournament> getTournamentsbyids(List<String> tournamentIds) {
        if (tournamentIds == null || tournamentIds.isEmpty()) {
            throw new IllegalArgumentException("Tournament IDs cannot be null or empty");
        }
        return tournamentRepository.findAllById(tournamentIds);
    }

}
