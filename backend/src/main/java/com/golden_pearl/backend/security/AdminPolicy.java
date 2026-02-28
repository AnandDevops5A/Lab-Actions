package com.golden_pearl.backend.security;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AdminPolicy {
    private final Set<String> adminContacts;

    public AdminPolicy(@Value("${ADMIN_CONTACTS:}") String adminContactsCsv) {
        if (adminContactsCsv == null || adminContactsCsv.isBlank()) {
            this.adminContacts = Collections.emptySet();
            return;
        }
        this.adminContacts = Arrays.stream(adminContactsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toUnmodifiableSet());
    }

    public boolean isAdminContact(Long contact) {
        if (contact == null) return false;
        return adminContacts.contains(String.valueOf(contact));
    }
}

