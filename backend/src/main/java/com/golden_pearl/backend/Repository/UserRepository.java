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
    
     @Query("SELECT u FROM User u LEFT JOIN FETCH u.loginTimeLines WHERE u.contact = :contact")
    Optional<User> findByContactWithLoginTimelines(@Param("contact") Long contact);

    User findByContactAndAccessKey(Long contact, String accessKey);

    List<User> findByContactAndEmail(Long contact, String email);


    boolean existsByContact(Long contact);

}
