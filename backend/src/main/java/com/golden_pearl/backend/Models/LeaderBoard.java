package com.golden_pearl.backend.Models;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
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
    name = "leaderboard",
    indexes = {
        @Index(name = "idx_leaderboard_user_id", columnList = "user_id"),
        @Index(name = "idx_leaderboard_tournament_id", columnList = "tournament_id"),
        @Index(name = "idx_leaderboard_game_id", columnList = "game_id"),
        @Index(name = "idx_leaderboard_rank", columnList = "rank"),
        @Index(name = "idx_leaderboard_time", columnList = "time"),
        @Index(name = "idx_leaderboard_is_approved", columnList = "is_approved"),
        // Common query pattern: "get this user's rank in this tournament"
        @Index(name = "idx_leaderboard_tournament_user", columnList = "tournament_id, user_id"),
        // Common query pattern: "leaderboard for a tournament, sorted by rank"
        @Index(name = "idx_leaderboard_tournament_rank", columnList = "tournament_id, rank")
    },
    uniqueConstraints = {
        // A given transaction should only ever produce one leaderboard entry
        @UniqueConstraint(name = "uq_leaderboard_transaction_id", columnNames = "transaction_id"),
        // Prevents duplicate entries for the same user in the same tournament/game,
        // remove this if a user CAN legitimately have multiple entries (e.g. multiple attempts)
        @UniqueConstraint(name = "uq_leaderboard_user_tournament_game", columnNames = {"user_id", "tournament_id", "game_id"})
    }
)
// Avoid @Data on entities — see note in User.java. No lazy collections here,
// but it's still bad practice: generated equals/hashCode over all fields can
// cause issues if this entity ever participates in a Set or gets compared.
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class LeaderBoard {

    @Id
    @UuidGenerator
    @EqualsAndHashCode.Include
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    // Consider making this a proper @ManyToOne to User instead of a raw String,
    // so referential integrity is enforced at the DB level. Keeping as String
    // here to match your current User.id type without forcing a bigger refactor.
    @ToString.Include
    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @ToString.Include
    @Column(name = "tournament_id", nullable = false, length = 36)
    private String tournamentId;

    @ToString.Include
    @Column(name = "game_id", nullable = false, length = 36)
    private String gameId;

    @Column(name = "temp_email", length = 255)
    private String tempEmail;

    @EqualsAndHashCode.Include
    @Column(name = "transaction_id", nullable = false, length = 100)
    private String transactionId;

    // Switched to BigDecimal to match the money-field fix applied to User —
    // keep Integer only if these are intentionally smallest-unit (paise/cents) integers.
    @Builder.Default
    @Column(name = "invest_amount", nullable = false, precision = 30, scale = 2)
    private BigDecimal investAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "win_amount", nullable = false, precision = 30, scale = 2)
    private BigDecimal winAmount = BigDecimal.ZERO;

    @ToString.Include
    @Column(name = "rank")
    private Integer rank;

    @ToString.Include
    @Column(name = "time", nullable = false)
    private LocalDateTime time;

    @ToString.Include
    @Column(name = "score")
    private Integer score;

    @Builder.Default
    @ToString.Include
    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Protects against lost updates if rank/approval status is modified
    // concurrently (e.g. a recalculation job + an admin approval at the same time).
    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}