package com.testing.springpractice.community.Repos;

import com.testing.springpractice.community.Models.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintRepo extends MongoRepository<Complaint, String> {
}
