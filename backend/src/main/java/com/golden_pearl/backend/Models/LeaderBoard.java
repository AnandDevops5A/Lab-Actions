package com.golden_pearl.backend.Models;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user", "tournament"})
@Entity
@Table(
    name = "leaderboard",
    indexes = {
        @Index(name = "idx_leaderboard_user_id", columnList = "user_id"),
        @Index(name = "idx_leaderboard_tournament_id", columnList = "tournament_id"),
        // Primary compound index for fast leaderboard sorting
        @Index(name = "idx_leaderboard_score_rank", columnList = "tournament_id, score DESC, rank ASC")
    },
    uniqueConstraints = {
        // Enforces one leaderboard entry per user per transaction
        @UniqueConstraint(name = "uq_leaderboard_transaction_id", columnNames = {"transaction_id"}),
        // Prevents duplicate entries for the same user in the same tournament
        @UniqueConstraint(name = "uq_leaderboard_user_tournament", columnNames = {"user_id", "tournament_id"})
    }
)
public class LeaderBoard {

    @Id
    @UuidGenerator
    @EqualsAndHashCode.Include
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;

    // --- Essential Foreign Keys ---
    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    private String tempEmail; // Temporary email for users without a registered email address

    @Column(name = "game_id", length = 100)
    private String gameId;

    @Column(name = "tournament_id", nullable = false, length = 36)
    private String tournamentId;

    @Column(name = "registered_at")
    private LocalDateTime time;

    // --- Read-Only Entity Relationships ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", insertable = false, updatable = false)
    private Tournament tournament;

    // --- Essential Leaderboard Metrics ---
    @EqualsAndHashCode.Include
    @Column(name = "transaction_id", nullable = false, length = 100)
    private String transactionId;

    @Builder.Default
    @Column(name = "score", nullable = false)
    private Integer score = 0;

    @Column(name = "rank")
    private Integer rank;

    @Builder.Default
    @Column(name = "invest_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal investAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "win_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal winAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false;

    // --- Auditing & Concurrency Control ---
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}