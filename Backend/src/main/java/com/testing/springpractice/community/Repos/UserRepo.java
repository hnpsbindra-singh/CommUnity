package com.testing.springpractice.community.Repos;

import com.testing.springpractice.community.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends MongoRepository<User, String> {
    User findByUsername(String username);
}
