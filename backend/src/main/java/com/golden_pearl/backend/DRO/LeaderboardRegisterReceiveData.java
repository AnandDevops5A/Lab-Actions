package com.golden_pearl.backend.DRO;

public record LeaderboardRegisterReceiveData(String tournamentId
    , String userId, String transactionId,String tempEmail,String gameId) {

}
