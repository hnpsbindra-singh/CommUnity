package com.testing.springpractice.community.Repos;

import com.testing.springpractice.community.Models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepo extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
