package com.testing.springpractice.community.Services;

import com.testing.springpractice.community.DTO.CommentRequest;
import com.testing.springpractice.community.DTO.CommentResponse;
import com.testing.springpractice.community.Models.Comment;
import com.testing.springpractice.community.Models.Community;
import com.testing.springpractice.community.Models.Post;
import com.testing.springpractice.community.Models.User;
import com.testing.springpractice.community.Repos.CommentRepo;
import com.testing.springpractice.community.Repos.CommunityRepo;
import com.testing.springpractice.community.Repos.PostRepo;
import com.testing.springpractice.community.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    CommentRepo commentRepo;
    @Autowired
    CommunityRepo communityRepo;
    @Autowired
    PostRepo postRepo;
    public CommentResponse createComment(CommentRequest commentRequest, String postId) {

        Authentication authentication = SecurityContextHolder.getContext()
                        .getAuthentication();

        String username = authentication.getName();

        User user = userRepo.findByUsername(username);

        if(user == null) {
            throw new RuntimeException("User not found");
        }

        Post post =
                postRepo.findById(postId).orElseThrow(() ->
                        new RuntimeException("Invalid Post")
                );

        Community community = communityRepo.findById(post.getCommunityId()
                ).orElseThrow(() -> new RuntimeException("Invalid Community")
                );

        if(!community.getMemberId()
                .contains(user.getId())) {

            throw new RuntimeException("You are not a member");
        }

        Comment comment =
                new Comment();

        comment.setPostId(postId);

        comment.setDescription(commentRequest.getDescription());

        comment.setCommentatorId(user.getId());

        Comment saved = commentRepo.save(comment);

        return maptoCommentResponse(saved);
    }

    private CommentResponse maptoCommentResponse(Comment saved) {
        CommentResponse commentResponse = new CommentResponse();
        commentResponse.setDescription(saved.getDescription());
        User user = userRepo.findById(saved.getCommentatorId())
                .orElseThrow(()->new RuntimeException("Invalid User"));
        commentResponse.setCommentatorName(user.getName());
        return commentResponse;

    }

    public List<CommentResponse> getComments(String postId) {
        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();

        String username = authentication.getName();

        User user = userRepo.findByUsername(username);

        if(user == null) {
            throw new RuntimeException("User not found");
        }

        Post post =
                postRepo.findById(postId).orElseThrow(() ->
                        new RuntimeException("Invalid Post")
                );

        Community community = communityRepo.findById(post.getCommunityId()
        ).orElseThrow(() -> new RuntimeException("Invalid Community")
        );

        if(!community.getMemberId()
                .contains(user.getId())) {

            throw new RuntimeException("You are not a member");
        }


        List<Comment> get = commentRepo.findByPostId(postId);
        List<CommentResponse> res = new ArrayList<>();
        for (int i = 0; i < get.size(); i++) {
            res.add(maptoCommentResponse(get.get(i)));
        }
        return res;
    }
    public String deleteComment(String commentId) {

        Authentication authentication = SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        User user = userRepo.findByUsername(username);

        if(user == null) {throw new RuntimeException("User not found");
        }

        Comment comment = commentRepo.findById(commentId).orElseThrow(() ->
                        new RuntimeException("Invalid Comment"));

        if(!comment.getCommentatorId()
                .equals(user.getId())) {
            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        commentRepo.delete(comment);

        return "Comment Deleted Successfully";
    }
}
