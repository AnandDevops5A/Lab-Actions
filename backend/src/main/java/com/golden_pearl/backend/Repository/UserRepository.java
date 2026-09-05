package com.golden_pearl.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.golden_pearl.backend.Models.User;

import io.lettuce.core.dynamic.annotation.Param;

public interface UserRepository extends JpaRepository<User, String> {

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.loginTimeLines WHERE u.id = :id")
    Optional<User> findByIdWithLoginTimelines(@Param("id") String id);

    Optional<User> findByPhoneNumber(String contact);

    List<User> findByPhoneNumberAndEmail(String contact, String email);

    boolean existsByPhoneNumber(String contact);

}
