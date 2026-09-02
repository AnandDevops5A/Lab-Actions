package com.golden_pearl.backend.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    // Every cache that can hold data derived from a Tournament row. Kept as one
    // list so every mutating method evicts the same set -- previously several
    // methods (setLiveStreamLink, saveAllTournaments, delete*, addTournament)
    // forgot to evict "nextTournament" and "tournamentsByIds", which meant
    // those endpoints could serve stale data indefinitely after a write.
    private static final String CACHE_TOURNAMENT = "tournament";
    private static final String CACHE_TOURNAMENTS = "tournaments";
    private static final String CACHE_TOURNAMENTS_IDS = "tournamentsIds";
    private static final String CACHE_TOURNAMENTS_BY_IDS = "tournamentsByIds";
    private static final String CACHE_UPCOMING = "upcomingTournaments";
    private static final String CACHE_COMPLETED = "completedTournaments";
    private static final String CACHE_LAST = "lastTournament";
    private static final String CACHE_NEXT = "nextTournament";
    private static final String CACHE_ADMIN_DATA = "adminData";

    // constructor
    public TournamentService(TournamentRepository tournamentRepository, General general) {
        this.tournamentRepository = tournamentRepository;
        this.general = general;
    }

    // get all tournamentsIds

    @Cacheable(value = CACHE_TOURNAMENTS_IDS, sync = true)
    public List<String> getAllTournamentsIds() {
        return tournamentRepository.findAllIds();
    }

    // Delegates straight to the repository instead of pulling every id into
    // memory and doing a linear List.contains() scan. This is an indexed
    // existence check at the DB level (or a single cache hit if the entity is
    // already cached), and it stays correct even if the tournamentsIds cache
    // hasn't been refreshed yet.
    public boolean existsById(String id) {
        if (id == null) {
            return false;
        }
        return tournamentRepository.existsById(id);
    }

    // get all tournaments

    @Cacheable(value = CACHE_TOURNAMENTS, sync = true)
    public List<TournamentDTO> getAllTournaments() {
        try {
            List<Tournament> tournaments = tournamentRepository.findAll();
            if (tournaments.isEmpty()) {
                return new ArrayList<>();
            }
            return general.convertToDTOs(tournaments);
        } catch (Exception e) {
            logger.error("Failed to get all tournaments: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    // add tournament
    @Caching(evict = {
            @CacheEvict(value = CACHE_TOURNAMENTS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_IDS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_BY_IDS, allEntries = true),
            @CacheEvict(value = CACHE_UPCOMING, allEntries = true),
            @CacheEvict(value = CACHE_COMPLETED, allEntries = true),
            @CacheEvict(value = CACHE_LAST, allEntries = true),
            @CacheEvict(value = CACHE_NEXT, allEntries = true),
            @CacheEvict(value = CACHE_ADMIN_DATA, allEntries = true)
    })
    public List<TournamentDTO> addTournament(Tournament tournamentDetails) {
        // The startDateTime should be set in the request body by the client
        try {
            if (tournamentDetails == null)
                return new ArrayList<>();
            tournamentRepository.save(tournamentDetails);
            return getUpcomingTournaments();
        } catch (Exception e) {
            logger.error("Failed to add tournament: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    // get tournament by id
    @Cacheable(value = CACHE_TOURNAMENT, key = "#id", sync = true)
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
            @CacheEvict(value = CACHE_TOURNAMENT, key = "#id"),
            @CacheEvict(value = CACHE_TOURNAMENTS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_IDS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_BY_IDS, allEntries = true),
            @CacheEvict(value = CACHE_UPCOMING, allEntries = true),
            @CacheEvict(value = CACHE_COMPLETED, allEntries = true),
            @CacheEvict(value = CACHE_LAST, allEntries = true),
            @CacheEvict(value = CACHE_NEXT, allEntries = true),
            @CacheEvict(value = CACHE_ADMIN_DATA, allEntries = true)
    })
    public boolean deleteTournamentById(String id) {
        try {
            if (id == null || !existsById(id))
                return false;
            tournamentRepository.deleteById(id);
            logger.info("Tournament with id {} deleted successfully", id);
            return true;
        } catch (Exception e) {
            logger.error("Failed to delete tournament with id {}: {}", id, e.getMessage());
            return false;
        }
    }

    // delete tournaments by ids
    @Caching(evict = {
            @CacheEvict(value = CACHE_TOURNAMENT, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_IDS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_BY_IDS, allEntries = true),
            @CacheEvict(value = CACHE_UPCOMING, allEntries = true),
            @CacheEvict(value = CACHE_COMPLETED, allEntries = true),
            @CacheEvict(value = CACHE_LAST, allEntries = true),
            @CacheEvict(value = CACHE_NEXT, allEntries = true),
            @CacheEvict(value = CACHE_ADMIN_DATA, allEntries = true)
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
            @CacheEvict(value = CACHE_TOURNAMENT, key = "#tournamentDetails.id"),
            @CacheEvict(value = CACHE_TOURNAMENTS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_BY_IDS, allEntries = true),
            @CacheEvict(value = CACHE_UPCOMING, allEntries = true),
            @CacheEvict(value = CACHE_COMPLETED, allEntries = true),
            @CacheEvict(value = CACHE_LAST, allEntries = true),
            @CacheEvict(value = CACHE_NEXT, allEntries = true),
            @CacheEvict(value = CACHE_ADMIN_DATA, allEntries = true)
    })
    public TournamentDTO updateTournament(TournamentUpdateDRO tournamentDetails) {
        try {
            if (tournamentDetails == null || !existsById(tournamentDetails.id()))
                return null;
            Tournament existingTournament = getTournamentById(tournamentDetails.id());
            if (existingTournament == null)
                return null;
            existingTournament
                    .setTournamentName(tournamentDetails.tournamentName() != null ? tournamentDetails.tournamentName()
                            : existingTournament.getTournamentName());
            existingTournament.setPrizePool(tournamentDetails.prizePool() != null ? tournamentDetails.prizePool()
                    : existingTournament.getPrizePool());
            existingTournament.setDateTime(
                    tournamentDetails.dateTime() != null ? tournamentDetails.dateTime()
                            : existingTournament.getDateTime());
            existingTournament.setPlatform(
                    tournamentDetails.platform() != null ? tournamentDetails.platform()
                            : existingTournament.getPlatform());
            existingTournament.setDescription(tournamentDetails.description() != null ? tournamentDetails.description()
                    : existingTournament.getDescription());
            existingTournament.setEntryFee(
                    tournamentDetails.entryFee() != null ? tournamentDetails.entryFee()
                            : existingTournament.getEntryFee());
            existingTournament
                    .setSlot(
                            tournamentDetails.slot() != null ? tournamentDetails.slot() : existingTournament.getSlot());
            TournamentDTO updated = general.convertToDTO(tournamentRepository.save(existingTournament));
            logger.info("Tournament {} updated successfully", tournamentDetails.id());
            return updated;
        } catch (Exception e) {
            logger.error("Failed to update tournament: {}", e.getMessage());
            return null;
        }
    }

    // get completed tournaments
    @Cacheable(value = CACHE_COMPLETED, sync = true)
    public List<TournamentDTO> getCompletedTournaments() {
        List<Tournament> completedTournaments = tournamentRepository.findAllCompletedTournaments(general.getCurrentTimeMillis());
        return general.convertToDTOs(completedTournaments != null ? completedTournaments : new ArrayList<>());
    }

    // get upcoming tournaments
    @Cacheable(value = CACHE_UPCOMING, sync = true)
    public List<TournamentDTO> getUpcomingTournaments() {
        List<Tournament> upcomingTournaments = tournamentRepository.findAllUpcomingTournaments(general.getCurrentTimeMillis());
        return general.convertToDTOs(upcomingTournaments != null ? upcomingTournaments : new ArrayList<>());
    }

    // get last tournament
    @Cacheable(value = CACHE_LAST, sync = true)
    public TournamentDTO getLastTournament() {
        TournamentDTO lastTournament = general.convertToDTO(tournamentRepository.findLastCompletedTournament(general.getCurrentTimeMillis()));
        return lastTournament != null ? lastTournament : new TournamentDTO();
    }

    // save all tournaments
    @Caching(evict = {
            @CacheEvict(value = CACHE_TOURNAMENT, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_IDS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_BY_IDS, allEntries = true),
            @CacheEvict(value = CACHE_UPCOMING, allEntries = true),
            @CacheEvict(value = CACHE_COMPLETED, allEntries = true),
            @CacheEvict(value = CACHE_LAST, allEntries = true),
            @CacheEvict(value = CACHE_NEXT, allEntries = true),
            @CacheEvict(value = CACHE_ADMIN_DATA, allEntries = true)
    })
    public List<TournamentDTO> saveAllTournaments(List<TournamentUpdateDRO> tournaments) {

        if (tournaments == null || tournaments.isEmpty()) {
            throw new IllegalArgumentException("Tournament list cannot be null or empty");
        }
        List<Tournament> tournamentsToSave = convertTournamentDROsToTournaments(tournaments);
        if (tournamentsToSave.isEmpty())
            return new ArrayList<>();

        Iterable<Tournament> savedTournaments = tournamentRepository.saveAll(tournamentsToSave);
        List<Tournament> savedTournamentList = new ArrayList<>();
        savedTournaments.forEach(savedTournamentList::add);
        return general.convertToDTOs(savedTournamentList);
    }

    // get tournaments by ids
    @Cacheable(value = CACHE_TOURNAMENTS_BY_IDS, sync = true)
    public List<TournamentDTO> getTournamentsbyids(List<String> tournamentIds) {
        if (tournamentIds == null || tournamentIds.isEmpty()) {
            throw new IllegalArgumentException("Tournament IDs cannot be null or empty");
        }
        List<Tournament> found = tournamentRepository.findAllById(tournamentIds);
        // findAllById silently skips ids that don't exist; if the caller expects
        // every id to resolve, treat a partial result as "not found" instead of
        // returning a mismatched subset.
        if (found.size() != tournamentIds.size()) {
            logger.info("One or more tournament ids not found in request: {}", tournamentIds);
            return new ArrayList<>();
        }
        return general.convertToDTOs(found);
    }

    // convert tournamentDROs to tournaments
    public List<Tournament> convertTournamentDROsToTournaments(List<TournamentUpdateDRO> tournamentDROs) {
        if (tournamentDROs == null) {
            return new ArrayList<>();
        }
        return tournamentDROs.stream()
                .map(this::convertTournamentDROtoTournament)
                .toList();
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

    @Caching(evict = {
            @CacheEvict(value = CACHE_TOURNAMENT, key = "#tournamentLiveStreamLinkDRO.tournamentId"),
            @CacheEvict(value = CACHE_TOURNAMENTS, allEntries = true),
            @CacheEvict(value = CACHE_TOURNAMENTS_BY_IDS, allEntries = true),
            @CacheEvict(value = CACHE_UPCOMING, allEntries = true),
            @CacheEvict(value = CACHE_COMPLETED, allEntries = true),
            @CacheEvict(value = CACHE_LAST, allEntries = true),
            @CacheEvict(value = CACHE_NEXT, allEntries = true),
            @CacheEvict(value = CACHE_ADMIN_DATA, allEntries = true)
    })
    public boolean setLiveStreamLink(TournamentLiveStreamLinkDRO tournamentLiveStreamLinkDRO) {
        if (tournamentLiveStreamLinkDRO == null || !existsById(tournamentLiveStreamLinkDRO.tournamentId()))
            return false;
        Tournament tournament = getTournamentById(tournamentLiveStreamLinkDRO.tournamentId());
        if (tournament == null)
            return false;
        try {
            tournament.setLiveStreamLink(tournamentLiveStreamLinkDRO.liveStreamLink());
            tournamentRepository.save(tournament);
            logger.info("Live stream link set successfully for tournament {}", tournamentLiveStreamLinkDRO.tournamentId());
            return true;
        } catch (Exception e) {
            logger.error("Failed to set live stream link: {}", e.getMessage());
            return false;
        }
    }

    @Cacheable(value = CACHE_NEXT, sync = true)
    public TournamentDTO getNextTournament() {
        List<TournamentDTO> upcomingTournaments = getUpcomingTournaments();
        if (upcomingTournaments == null || upcomingTournaments.isEmpty()) {
            return null;
        }

        return upcomingTournaments.stream()
                .min(Comparator.comparingLong(TournamentDTO::getDateTime))
                .orElse(null);
    }
}