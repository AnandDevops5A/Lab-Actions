package com.golden_pearl.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.golden_pearl.backend.Models.User;

public interface UserRepository extends MongoRepository<User, String>{
    
    User findByCallSignAndAccessKey(String callSign , String accessKey);
    User findByContactAndAccessKey(Long contact , String accessKey);
    List<User> findByPlayedTournamentsNotNull();

}
