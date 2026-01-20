package com.golden_pearl.backend.DRO;

public record TournamentReceiveData(String tournamentName, Integer prizePool, Long dateTime,
        Integer slot, String platform, String description) {

}
