package com.golden_pearl.backend.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.golden_pearl.backend.Models.Tournament;

public interface TournamentRepository extends JpaRepository<Tournament, String> {

    // Finds tournaments where the startDateTime is after the provided time, ordered
    // by the start time
 

    // Custom query to fetch only tournament IDs
    @Query("select t.id from Tournament t")
    List<String> findAllIds();

    @Query("SELECT t FROM Tournament t WHERE t.dateTime < :currentDateTime")
    List<Tournament> findAllCompletedTournaments(Long currentDateTime);

    @Query("SELECT t FROM Tournament t WHERE t.dateTime > :currentDateTime")
    List<Tournament> findAllUpcomingTournaments(Long currentDateTime);

    // find the lastest completed tournament based on dateTime
    @Query("SELECT t FROM Tournament t WHERE t.dateTime < :currentDateTime ORDER BY t.dateTime DESC")
    Tournament findLastCompletedTournament(Long currentDateTime);


}
