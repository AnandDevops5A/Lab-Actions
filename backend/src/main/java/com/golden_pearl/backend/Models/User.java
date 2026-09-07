package com.golden_pearl.backend.Models;

import java.math.BigDecimal;
import java.time.Instant;
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

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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
@Table(name = "users", indexes = {
        @Index(name = "idx_users_id", columnList = "id"),
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_call_sign", columnList = "call_sign"),
        @Index(name = "idx_users_joining_date", columnList = "created_at"),
        @Index(name = "idx_users_phone_number", columnList = "phone_number")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_users_username", columnNames = "username"),
        @UniqueConstraint(name = "uq_users_email", columnNames = "email"),
        @UniqueConstraint(name = "uq_users_phone_number", columnNames = "phone_number")
})
// Never use @Data on an entity: it generates equals/hashCode/toString over
// ALL fields, including lazy collections — forcing Hibernate to hit the DB
// just to log or compare, and risking LazyInitializationException outside a
// session or infinite recursion on bidirectional relations. equals/hashCode
// use only the immutable identity fields below.
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class User {

    @Id
    @UuidGenerator
    @EqualsAndHashCode.Include
    @Column(updatable = false, nullable = false, length = 36)
    private String id;

    @EqualsAndHashCode.Include
    @ToString.Include
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, unique = true, length = 100)
    private String username;

    // @ElementCollection(fetch = FetchType.LAZY)
    // @CollectionTable(
    // name = "user_player_ids",
    // joinColumns = @JoinColumn(name = "user_id"),
    // indexes = @Index(name = "idx_user_player_ids_user_id", columnList =
    // "user_id"))
    // @Column(name = "player_id", length = 100)
    // @ToString.Exclude
    // private List<String> playerIds;

    @ToString.Include
    @Size(max = 100)
    @Column(name = "call_sign", length = 100)
    private String callSign;

    @ToString.Include
    @NotBlank
    @Email
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    // Sensitive — excluded from toString/equals and must never be serialized
    // in API responses (use a DTO, not this entity). Store as a salted hash
    // (BCrypt/Argon2), never plaintext.
    @ToString.Exclude
    @Column(name = "access_key", length = 255)
    private String accessKey;

    // String, not Long: phone numbers aren't arithmetic values — Long drops
    // leading zeros and can't hold a "+countrycode" prefix.
    @Size(max = 20)
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Builder.Default
    @Column(name = "withdraw_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal withdrawAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "balance_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal balanceAmount = BigDecimal.ZERO;

    @Builder.Default
    @ToString.Include
    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean active = true;

    // @ElementCollection(fetch = FetchType.LAZY)
    // @CollectionTable(
    // name = "user_login_timelines",
    // joinColumns = @JoinColumn(name = "user_id"),
    // indexes = @Index(name = "idx_user_login_timelines_user_id", columnList =
    // "user_id"))
    // @Column(name = "login_time")
    // @ToString.Exclude
    // private List<LocalDateTime> loginTimeLines;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_password_reset_timelines", joinColumns = @JoinColumn(name = "user_id"), indexes = @Index(name = "idx_user_password_reset_timelines_user_id", columnList = "user_id"))
    @Column(name = "reset_time")
    @ToString.Exclude
    private List<LocalDateTime> passwordResetTimeLines;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Prevents lost updates when two requests modify the same user
    // concurrently (e.g. simultaneous balance updates).
    @ToString.Exclude
    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}