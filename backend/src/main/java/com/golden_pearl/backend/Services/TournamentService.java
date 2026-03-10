package com.golden_pearl.backend.Services;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.DRO.TournamentLiveStreamLinkDRO;
import com.golden_pearl.backend.DRO.TournamentUpdateDRO;
import com.golden_pearl.backend.DTO.TournamentDTO;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.common.General;
import com.golden_pearl.backend.errors.ResourceNotFoundException;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
        private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);

    private final General general;

    // constructor
    public TournamentService(TournamentRepository tournamentRepository, General general) {
        this.tournamentRepository = tournamentRepository;
        this.general = general;
    }
    
 // get all tournamentsIds

    @Cacheable(value = "tournamentsIds", sync = true)
    public List<String> getAllTournamentsIds() {
        return tournamentRepository.findAllIds().stream()
                .map(Tournament::getId)
                .collect(Collectors.toList());
    }

    public boolean existsById(String id) {
        return getAllTournamentsIds().contains(id);
    }

    // get all tournaments

    @Cacheable(value = "tournaments", sync = true)
    public List<TournamentDTO> getAllTournaments() {
        return general.convertToDTOs(tournamentRepository.findAll());
    }

    // add tournament
    @Caching(evict = {
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "tournamentsIds", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public List<TournamentDTO> addTournament(Tournament tournamentDetails) {
        // The startDateTime should be set in the request body by the client
        if (tournamentDetails == null)
            return new ArrayList<>();
        tournamentRepository.save(tournamentDetails);
        return getUpcomingTournaments();
    }

    // get tournament by id
    @Cacheable(value = "tournament", key = "#id",sync = true)
    public Tournament getTournamentById(String id) {
        if (id == null)
            return null;
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }

    public TournamentDTO getTournamentDTOById(String id) {
        Tournament tournament = getTournamentById(id);
        return general.convertToDTO(tournament);
    }

    // delete tournament by id
    @Caching(evict = {
            @CacheEvict(value = "tournament", key = "#id" ),
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "tournamentsIds", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "completedTournaments", allEntries = true),
            @CacheEvict(value = "lastTournament", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public boolean deleteTournamentById(String id) {
        if (id == null || !existsById(id))
            return false;
        tournamentRepository.deleteById(id);
        logger.info("Tournament with id {} deleted successfully", id);
        return true;
    }

     // delete tournament by id
    @Caching(evict = {
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "tournament", allEntries = true),
                @CacheEvict(value = "tournamentsIds", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "completedTournaments", allEntries = true),
            @CacheEvict(value = "lastTournament", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public boolean deleteTournamentsByIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return false;
        }
        for (String id : ids) {
            if (!existsById(id)) {
                logger.info("Tournament with id {} not found", id);
                return false;
            }
        }
        tournamentRepository.deleteAllById(ids);
        logger.info("Tournaments deleted successfully: {}", ids.size());
        return true;
    }

    // update tournament by id
    @Caching(evict = {
            @CacheEvict(value = "tournament", key = "#tournamentDetails.id"),
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "lastTournament", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true),
    })
    public TournamentDTO updateTournament(TournamentUpdateDRO tournamentDetails) {
        if ( !existsById(tournamentDetails.id()))
            return null;
        Tournament existingTournament = getTournamentById(tournamentDetails.id());
        if (existingTournament == null)
            return null;
        existingTournament.setTournamentName(tournamentDetails.tournamentName() != null ? tournamentDetails.tournamentName() : existingTournament.getTournamentName());
        existingTournament.setPrizePool(tournamentDetails.prizePool() != null ? tournamentDetails.prizePool() : existingTournament.getPrizePool());
        existingTournament.setDateTime(tournamentDetails.dateTime() != null ? tournamentDetails.dateTime() : existingTournament.getDateTime());
        existingTournament.setPlatform(tournamentDetails.platform() != null ? tournamentDetails.platform() : existingTournament.getPlatform());
        existingTournament.setDescription(tournamentDetails.description() != null ? tournamentDetails.description() : existingTournament.getDescription());
        existingTournament.setEntryFee(tournamentDetails.entryFee() != null ? tournamentDetails.entryFee() : existingTournament.getEntryFee());
        existingTournament.setSlot(tournamentDetails.slot() != null ? tournamentDetails.slot() : existingTournament.getSlot());
        logger.info("Tournament updated successfully");
        return general.convertToDTO(tournamentRepository.save(existingTournament));
    }

    // get completed tournaments
    @Cacheable(value = "completedTournaments", sync = true)
    public List<TournamentDTO> getCompletedTournaments() {
        return general.convertToDTOs(tournamentRepository.findByDateTimeLessThan(general.getCurrentDateTime()));
    }

    // get upcoming tournaments
    @Cacheable(value = "upcomingTournaments", sync = true)
    public List<TournamentDTO> getUpcomingTournaments() {
        return general.convertToDTOs(tournamentRepository.findByDateTimeGreaterThan(general.getCurrentDateTime()));
    }

    // get last tournament
    @Cacheable(value = "lastTournament", sync = true)
    public TournamentDTO getLastTournament() {
        return general.convertToDTO(tournamentRepository.findFirstByDateTimeLessThan(general.getCurrentDateTime()));
    }

    // save all tournaments
    @Caching(evict = {
            @CacheEvict(value = "tournament", allEntries = true),
            @CacheEvict(value = "tournaments", allEntries = true),
            @CacheEvict(value = "tournamentsIds", allEntries = true),
            @CacheEvict(value = "upcomingTournaments", allEntries = true),
            @CacheEvict(value = "completedTournaments", allEntries = true),
            @CacheEvict(value = "lastTournament", allEntries = true),
            @CacheEvict(value = "adminData", allEntries = true)
    })
    public List<TournamentDTO> saveAllTournaments(List<TournamentUpdateDRO> tournaments) {

        if (tournaments == null || tournaments.isEmpty()) {
            throw new IllegalArgumentException("Tournament list cannot be null or empty");
        }
       Iterable<Tournament> savedTournaments =tournamentRepository.saveAll(convertTournamentDROsToTournaments(tournaments));
        //type of savedTournaments is Iterable<Tournament>, we need to convert it to List<Tournament> to convert it to List<TournamentDTO>
        List<Tournament> savedTournamentList = new ArrayList<>();
        savedTournaments.forEach(savedTournamentList::add);
       return general.convertToDTOs(savedTournamentList);
    }

    // register user for a tournament

    @Cacheable(value = "tournamentsByIds", sync = true)
    public List<TournamentDTO> getTournamentsbyids(List<String> tournamentIds) {
        if (tournamentIds == null || tournamentIds.isEmpty()) {
            throw new IllegalArgumentException("Tournament IDs cannot be null or empty");
        }
        //checking all id exists or not
        for (String id : tournamentIds) {
            if (!existsById(id)) {
                logger.info("Tournament not found with id: {}", id);
                return new ArrayList<>();
            }
        }
        return general.convertToDTOs(tournamentRepository.findAllById(tournamentIds));
    }

   

    // convert tournamentDROs to tournaments
    public List<Tournament> convertTournamentDROsToTournaments(List<TournamentUpdateDRO> tournamentDROs) {
        if (tournamentDROs == null) {
            return null;
        }
        return tournamentDROs.stream()
                .map(this::convertTournamentDROtoTournament)
                .collect(Collectors.toList());
    }

    private Tournament convertTournamentDROtoTournament(TournamentUpdateDRO dro) {
        Tournament tournament = new Tournament();
        tournament.setId(dro.id());
        tournament.setTournamentName(dro.tournamentName());
        tournament.setPrizePool(dro.prizePool());
        tournament.setDateTime(dro.dateTime());
        tournament.setEntryFee(dro.entryFee());
        tournament.setSlot(dro.slot());
        tournament.setPlatform(dro.platform());
        tournament.setDescription(dro.description());
        return tournament;
    }

    @CacheEvict(value = "tournament", key = "#tournamentLiveStreamLinkDRO.tournamentId")
    public boolean setLiveStreamLink(TournamentLiveStreamLinkDRO tournamentLiveStreamLinkDRO) {
        if (tournamentLiveStreamLinkDRO == null || !existsById(tournamentLiveStreamLinkDRO.tournamentId()))
            return false;
        Tournament tournament = getTournamentById(tournamentLiveStreamLinkDRO.tournamentId());
        if (tournament == null)
            return false;
       try {
        tournament.setLiveStreamLink(tournamentLiveStreamLinkDRO.liveStreamLink());
        tournamentRepository.save(tournament);
        logger.info("Live stream link set successfully");
        return true;
       } catch (Exception e) {
        logger.error("Failed to set live stream link: {}", e.getMessage());
        return false;
       } 
        
    }

    @Cacheable(value = "nextTournament", sync = true)
    public Tournament getNextTournament() {
        List<TournamentDTO> upcomingTournaments = getUpcomingTournaments();
        if (upcomingTournaments == null || upcomingTournaments.isEmpty()) {
            return null;
        }

        // Find the DTO with the minimum dateTime using a stream for cleaner code
        // and then map it to the full Tournament entity.
        return upcomingTournaments.stream()
                .min((t1, t2) -> Long.compare(t1.getDateTime(), t2.getDateTime()))
                .map(dto -> getTournamentById(dto.getId()))
                .orElse(null);
    }
}
