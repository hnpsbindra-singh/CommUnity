package com.testing.springpractice.community.Controllers;

import com.testing.springpractice.community.DTO.*;
import com.testing.springpractice.community.Models.Comment;
import com.testing.springpractice.community.Repos.CommunityRepo;
import com.testing.springpractice.community.Services.CommentService;
import com.testing.springpractice.community.Services.CommunityService;
import com.testing.springpractice.community.Services.PostService;
import com.testing.springpractice.community.Services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    CommunityService communityService;

    @Autowired
    CommentService commentService;

    @Autowired
    PostService postService;

    @Autowired
    ProfileService profileService;


    @PostMapping("/community/create")
    public CommunityResponse create(@RequestParam String communityName){

        return communityService.create(communityName);
    }

    @PostMapping("/community/join/{joinCode}")
    public void JoinRequest(@PathVariable String joinCode){

        communityService.joinRequest(joinCode);
    }

    @DeleteMapping("/community/leave/{communityId}")
    public String leave(@PathVariable String communityId){

        return communityService.leave(communityId);
    }

    @GetMapping("/community/all")
    public List<ViewCommunity> viewAll(){
        return communityService.viewAll();
    }

    @GetMapping("/community/my")
    public List<ViewCommunity> my(){
        return communityService.myCommunities();
    }

    @GetMapping("/community/{communityId}")
    public CommunityDetails Details(@PathVariable String communityId){
        return communityService.Details(communityId);
    }


    @PostMapping("/post/create/{communityId}")
    public PostResponse createAPost(@RequestBody PostRequest request,
                                    @PathVariable String communityId){

        return postService.createAPost(request, communityId);

    }

    @GetMapping("/post/community/{communityId}")
    public List<PostResponse> getPosts(@PathVariable String communityId ){
        return postService.getPosts(communityId);
    }

    @GetMapping("/post/{postId}")
    public PostResponse getPost(@PathVariable String postId ){
        return postService.getPost(postId);
    }

    @DeleteMapping("/post/{postId}")
    public String deletePost(@PathVariable String postId){
        return postService.deletePost(postId);
    }

    @PatchMapping("/post/feel-good/{postId}")
    public String feelGood(@PathVariable String postId) {
        return postService.feelGood(postId);
    }

    @PostMapping("/comment/create/{postId}")
    public CommentResponse createComment(@RequestBody CommentRequest commentRequest, @PathVariable String postId){

        return commentService.createComment(commentRequest, postId);

    }
    @GetMapping("/comment/{postId}")
    public List<CommentResponse> getComments(@PathVariable String postId){

        return commentService.getComments(postId);

    }
    @DeleteMapping("/comment/{commentId}")
    public String deleteComment(
            @PathVariable String commentId
    ) {

        return commentService.deleteComment(
                commentId
        );
    }
    @GetMapping("/me")
    public RegisterResponse getDetails(){
        return profileService.getDetails();
    }



    @PatchMapping("/update-profile")
    public RegisterResponse updateProfile(
            @RequestBody UpdateProfileRequest request
    ) {

        return profileService.updateProfile(
                request
        );
    }



}
