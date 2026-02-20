package com.golden_pearl.backend.DRO;

public record UserDetailsUpdateReceive(
    String userId, String name, String email, Long contact, String callSign, String accessKey) {

}
