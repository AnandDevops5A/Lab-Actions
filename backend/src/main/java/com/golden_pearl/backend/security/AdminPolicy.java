package com.golden_pearl.backend.security;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AdminPolicy {

    private static final String DEFAULT_ADMIN_CONTACTS = "7254831884,917254831884";
    private final Set<String> adminContacts;

    public AdminPolicy(@Value("${ADMIN_CONTACTS}") String adminContactsCsv) {
        String csvToProcess = (adminContactsCsv == null || adminContactsCsv.isBlank()) 
                ? DEFAULT_ADMIN_CONTACTS 
                : adminContactsCsv;

        // Strip non-digit characters (+, spaces, dashes) so " +91-7254831884 " becomes "917254831884"
        this.adminContacts = Arrays.stream(csvToProcess.split(","))
                .map(this::normalizeContact)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toUnmodifiableSet());
    }

    public boolean isAdminContact(String contact) {
        if (contact == null || contact.isBlank()) {
            return false;
        }
        return adminContacts.contains(normalizeContact(contact));
    }

    /**
     * Removes leading plus signs, dashes, spaces, and formatting characters.
     */
    private String normalizeContact(String contact) {
        return contact.trim().replaceAll("[^0-9]", "");
    }
}