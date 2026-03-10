package com.golden_pearl.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TournamentDTO {

    String id;
    String tournamentName;
    Integer prizePool;
    Long dateTime;
    Integer entryFee;
    Integer slot;
    String platform;
    String description;
    String liveStreamLink;



}
