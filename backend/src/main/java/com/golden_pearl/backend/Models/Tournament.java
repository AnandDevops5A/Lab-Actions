package com.golden_pearl.backend.Models;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
@Table(name = "tournaments", indexes = {
        @Index(name = "idx_tournaments_date_time", columnList = "date_time"),
        @Index(name = "idx_tournaments_platform", columnList = "platform"),
        @Index(name = "idx_tournaments_tournament_name", columnList = "tournament_name"),
        @Index(name = "idx_tournaments_tournament_id", columnList = "id")
})
// Avoid @Data on entities — see notes on User.java / LeaderBoard.java.
// leaderBoard is @Transient (never loaded by Hibernate) so it won't throw
// LazyInitializationException, but it's still excluded below since it's not
// part of this entity's persistent identity and is usually null.
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Tournament {

    @Id
    @UuidGenerator
    @EqualsAndHashCode.Include
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @ToString.Include
    @Column(name = "tournament_name", nullable = false, length = 255)
    private String tournamentName;

    @ToString.Include
    @Column(name = "prize_pool")
    private Integer prizePool;

    @ToString.Include
    @Column(name = "date_time")
    private Long dateTime;

    @Column(name = "entry_fee")
    private Integer entryFee;

    @Builder.Default
    @ToString.Include
    @Column(name = "slot", nullable = false)
    private Integer slot = 50;

    @ToString.Include
    @Column(name = "platform", length = 100)
    private String platform;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "live_stream_link", length = 500)
    private String liveStreamLink;

    // Not persisted — populated manually in service code when you need to
    // attach leaderboard entries to a tournament response (e.g. a DTO builder).
    @Transient
    private List<LeaderBoard> leaderBoard;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}