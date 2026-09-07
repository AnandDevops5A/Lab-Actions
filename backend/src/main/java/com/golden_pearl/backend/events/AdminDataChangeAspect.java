package com.golden_pearl.backend.events;

import java.util.Arrays;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AdminDataChangeAspect {
    private static final String ADMIN_DATA_CACHE = "adminData";

    private final ApplicationEventPublisher eventPublisher;

    public AdminDataChangeAspect(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @AfterReturning("@annotation(caching)")
    public void publishAdminDataChange(Caching caching) {
        boolean evictsAdminData = Arrays.stream(caching.evict())
                .flatMap(eviction -> Arrays.stream(eviction.cacheNames()))
                .anyMatch(ADMIN_DATA_CACHE::equals);

        if (evictsAdminData) {
            eventPublisher.publishEvent(new AdminDataChangedEvent());
        }
    }
}