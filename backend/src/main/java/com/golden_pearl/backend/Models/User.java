package com.golden_pearl.backend.Models;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_id", columnList = "id"),
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_call_sign", columnList = "call_sign"),
        @Index(name = "idx_users_joining_date", columnList = "joining_date")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_users_username", columnNames = "username"),
        @UniqueConstraint(name = "uq_users_email", columnNames = "email")
    }
)
// Never use @Data on an entity: it generates equals/hashCode/toString over
// ALL fields, including lazy collections — that forces Hibernate to hit the
// DB just to log or compare the entity, and can throw LazyInitializationException
// outside a session, or cause infinite recursion with bidirectional relations.
@EqualsAndHashCode(onlyExplicitlyIncluded  = true)
@ToString(onlyExplicitlyIncluded  = true)
public class User {

    @Id
    @UuidGenerator
    @EqualsAndHashCode.Include
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @EqualsAndHashCode.Include
    @ToString.Include
    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "user_player_ids",
        joinColumns = @JoinColumn(name = "user_id"),
        indexes = @Index(name = "idx_user_player_ids_user_id", columnList = "user_id")
    )
    @Column(name = "player_id", length = 100)
    private List<String> playerId;

    @ToString.Include
    @Column(name = "call_sign", length = 100)
    private String callSign;

    @ToString.Include
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    // Sensitive — deliberately excluded from toString/equals, and should never
    // be serialized in API responses either (use a DTO, not this entity).
    @Column(name = "access_key")
    private String accessKey;

    private Long contact;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Builder.Default
    @Column(name = "withdraw_amount", nullable = false, precision = 30, scale = 2)
    private BigDecimal withdrawAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "balance_amount", nullable = false, precision = 30, scale = 2)
    private BigDecimal balanceAmount = BigDecimal.ZERO;

    @Builder.Default
    @ToString.Include
    @Column(nullable = false)
    private boolean active = true;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "user_login_timelines",
        joinColumns = @JoinColumn(name = "user_id"),
        indexes = @Index(name = "idx_user_login_timelines_user_id", columnList = "user_id")
    )
    @Column(name = "login_time")
    private List<LocalDateTime> loginTimeLines;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "user_password_reset_timelines",
        joinColumns = @JoinColumn(name = "user_id"),
        indexes = @Index(name = "idx_user_password_reset_timelines_user_id", columnList = "user_id")
    )
    @Column(name = "reset_time")
    private List<LocalDateTime> passwordResetTimeLines;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Prevents lost updates when two requests modify the same user concurrently
    // (e.g. two simultaneous balance updates).
    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}