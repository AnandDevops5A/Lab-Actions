package com.golden_pearl.backend.Services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.Repository.TournamentRepository;
import com.golden_pearl.backend.errors.ResourceNotFoundException;

@Service
public class TournamentService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentService.class);

    private final TournamentRepository tournamentRepository;

    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    //get current dateTime in yyyyMMddHHmm format
    public long getCurrentDateTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        return Long.parseLong(LocalDateTime.now().format(formatter));
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Tournament addTournament(Tournament tournamentDetails) {
        // The startDateTime should be set in the request body by the client
        return tournamentRepository.save(tournamentDetails);
    }

    public Tournament getTournamentById(String id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found with id: " + id));
    }

    public void deleteTournamentById(String id) {
        tournamentRepository.deleteById(id);
    }

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

    public List<Tournament> getCompletedTournaments() {

        return tournamentRepository.findByDateTimeLessThan(getCurrentDateTime());
    }

    public List<Tournament> getUpcomingTournaments() {

        return tournamentRepository.findByDateTimeGreaterThan(getCurrentDateTime());
    }

    public Tournament getLastTournament(){
        return tournamentRepository.findFirstByDateTimeLessThan(getCurrentDateTime());
    }
}
