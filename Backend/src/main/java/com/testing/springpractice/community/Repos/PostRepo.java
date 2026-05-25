package com.testing.springpractice.community.Repos;

import com.testing.springpractice.community.Models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends MongoRepository<Post, String> {
    List<Post> findByCommunityId(String communityId);
}
