package com.golden_pearl.backend.DRO;

import java.math.BigDecimal;

public record UpdateLeaderboardEntry(Integer rank, BigDecimal investAmount, BigDecimal winAmount) {

}