package com.golden_pearl.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.golden_pearl.backend.Models.User;

public interface UserRepository extends MongoRepository<User, String>{
    
    User findByContactAndAccessKey(Long contact , String accessKey);
   List< User> findByContactAndEmail(Long contact , String email);

    boolean existsByContact(Long contact);


}
