package com.golden_pearl.backend.services;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.golden_pearl.backend.events.AdminDataChangedEvent;

@Service
public class AdminDataStreamService {
    private static final Logger log = LoggerFactory.getLogger(AdminDataStreamService.class);
    private static final long SSE_TIMEOUT_MS = 30 * 60 * 1000L;

    private final AdminService adminService;
    private final Set<SseEmitter> emitters = ConcurrentHashMap.newKeySet();

    public AdminDataStreamService(AdminService adminService) {
        this.adminService = adminService;
    }

    public SseEmitter connect() {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT_MS);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(error -> emitters.remove(emitter));

        try {
            send(emitter, adminService.getAllData());
        } catch (IOException | RuntimeException exception) {
            emitters.remove(emitter);
            emitter.completeWithError(exception);
        }

        return emitter;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void handleAdminDataChanged(AdminDataChangedEvent event) {
        Map<String, Object> data;
        try {
            data = adminService.getAllData();
        } catch (RuntimeException exception) {
            log.error("Failed to broadcast updated admin data", exception);
            return;
        }

        emitters.removeIf(emitter -> !sendSafely(emitter, data));
    }

    private boolean sendSafely(SseEmitter emitter, Map<String, Object> data) {
        try {
            send(emitter, data);
            return true;
        } catch (IOException | IllegalStateException exception) {
            emitter.complete();
            return false;
        }
    }

    private void send(SseEmitter emitter, Map<String, Object> data) throws IOException {
        emitter.send(SseEmitter.event().name("admin-data").data(Objects.requireNonNull(data)));
    }
}