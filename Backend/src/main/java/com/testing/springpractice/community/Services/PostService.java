package com.testing.springpractice.community.Services;

import com.testing.springpractice.community.DTO.PostRequest;
import com.testing.springpractice.community.DTO.PostResponse;
import com.testing.springpractice.community.Models.Community;
import com.testing.springpractice.community.Models.Post;
import com.testing.springpractice.community.Models.User;
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
public class PostService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    CommunityRepo communityRepo;
    @Autowired
    PostRepo postRepo;
    public PostResponse createAPost(PostRequest request, String communityId) {
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepo.findByUsername(username);
        Community community = communityRepo.findById(communityId)
                .orElseThrow(()->new RuntimeException("Invalid Community"));
        if(!community.getMemberId().contains(user.getId())){
            throw new RuntimeException("Invalid Access");
        }
        Post post = new Post();
        post.setCommunityId(communityId);
        post.setDescription(request.getDescription());
        post.setTitle(request.getTitle());
        post.setUserId(user.getId());

        Post saved = postRepo.save(post) ;
        return mapToPostResponse(saved);

    }

    private PostResponse mapToPostResponse(Post saved) {
        User user = userRepo.findById(saved.getUserId())
                .orElseThrow(()-> new RuntimeException("Invalid User"));

        Community community = communityRepo.findById(saved.getCommunityId())
                .orElseThrow(()->new RuntimeException("Invalid Community"));

        PostResponse postResponse = new PostResponse();
        postResponse.setId(saved.getId());
        postResponse.setTitle(saved.getTitle());
        postResponse.setDescription(saved.getDescription());
        postResponse.setAuthorName(user.getName());
        postResponse.setCommunityName(community.getName());
        postResponse.setFeelsGood(saved.getFeelsGood());
        return postResponse;
    }


    public List<PostResponse> getPosts(String communityId) {
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepo.findByUsername(username);
        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }
        Community community = communityRepo.findById(communityId).orElseThrow(()->
                new RuntimeException("Invalid community"));
        if(!community.getMemberId().contains(user.getId())){
            throw new RuntimeException("Invalid Access");
        }
        List<Post> posts = postRepo.findByCommunityId(communityId);
        List<PostResponse> res = new ArrayList<>();
        for (int i = 0; i < posts.size(); i++) {
            res.add(mapToPostResponse(posts.get(i)));

        }
        return res;
    }

    public PostResponse getPost(String postId) {
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepo.findByUsername(username);
        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        Post post = postRepo.findById(postId).orElseThrow(()->
                new RuntimeException("Invalid Post"));
        Community community = communityRepo.findById(post.getCommunityId()).orElseThrow(()->
                new RuntimeException("Invalid community"));
        if(!community.getMemberId().contains(user.getId())){
            throw new RuntimeException("Invalid Access");
        }
        return mapToPostResponse(post);
    }

    public String deletePost(
            String postId
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        User user = userRepo.findByUsername(username);

        if(user == null) {
            throw new RuntimeException(
                    "User not found"
            );
        }

        Post post = postRepo.findById(postId).orElseThrow(() ->

                        new RuntimeException(
                                "Invalid Post"
                        )
                );

        if(!post.getUserId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }

        postRepo.delete(post);

        return "Deleted Successfully";
    }



    public String feelGood(
            String postId
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username =
                authentication.getName();

        User user =
                userRepo.findByUsername(
                        username
                );

        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        Post post =
                postRepo.findById(
                        postId
                ).orElseThrow(() ->

                        new RuntimeException(
                                "Invalid Post"
                        )
                );

        Community community =
                communityRepo.findById(
                        post.getCommunityId()
                ).orElseThrow(() ->

                        new RuntimeException(
                                "Invalid Community"
                        )
                );

        if(!community.getMemberId()
                .contains(user.getId())) {

            throw new RuntimeException(
                    "You are not a member"
            );
        }

        if(post.getFeelGoodUserIds()
                .contains(user.getId())) {

            post.getFeelGoodUserIds()
                    .remove(user.getId());
            post.setFeelsGood(post.getFeelsGood()-1);

            postRepo.save(post);

            return "Reaction Removed";
        }

        post.getFeelGoodUserIds()
                .add(user.getId());
        post.setFeelsGood(post.getFeelsGood()+1);

        postRepo.save(post);

        return "Reaction Added";
    }
}
