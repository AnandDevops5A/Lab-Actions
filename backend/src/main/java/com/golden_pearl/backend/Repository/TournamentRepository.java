package com.golden_pearl.backend.Repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.golden_pearl.backend.Models.Tournament;

public interface TournamentRepository extends MongoRepository<Tournament, String> {

    // Finds tournaments where the startDateTime is after the provided time, ordered
    // by the start time
    List<Tournament> findByDateTimeGreaterThan(long dateTime);
    List<Tournament> findByDateTimeLessThan(long dateTime);
    Tournament findFirstByDateTimeLessThan(long dateTime);


}
