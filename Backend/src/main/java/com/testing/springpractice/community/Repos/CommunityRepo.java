package com.testing.springpractice.community.Repos;

import com.testing.springpractice.community.Models.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepo extends MongoRepository<Community, String> {
   Community findByJoinCode(String joinCode);
}
