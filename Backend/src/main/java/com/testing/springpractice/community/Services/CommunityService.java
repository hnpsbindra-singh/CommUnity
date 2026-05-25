package com.testing.springpractice.community.Services;

import com.testing.springpractice.community.DTO.CommunityDetails;
import com.testing.springpractice.community.DTO.CommunityResponse;
import com.testing.springpractice.community.DTO.MemberResponse;
import com.testing.springpractice.community.DTO.ViewCommunity;
import com.testing.springpractice.community.Models.Community;
import com.testing.springpractice.community.Models.User;
import com.testing.springpractice.community.Repos.CommunityRepo;
import com.testing.springpractice.community.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class CommunityService {
    @Autowired
    CommunityRepo communityRepo;
    @Autowired
    UserRepo userRepo;
    public CommunityResponse create(String communityName) {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username =
                authentication.getName();

        User user = userRepo.findByUsername(
                username
        );
        String code = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();
        Community community = new Community();
        community.setAdminId(user.getId());
        community.getMemberId().add(user.getId());

        community.setName(communityName);
        community.setJoinCode(code);

        Community savedCommunity = communityRepo.save(community);
        user.getCommunityId().add(savedCommunity.getId());
        userRepo.save(user);

        return MapToCommunityResponse(savedCommunity);
    }

    private CommunityResponse MapToCommunityResponse(Community community) {
        User user = userRepo.findById(community.getAdminId())
                .orElseThrow(() ->
                new RuntimeException("User not found"));
        CommunityResponse response = new CommunityResponse();
        response.setId(community.getId());
        response.setName(community.getName());
        response.setAdminName(user.getName());
        response.setJoinCode(community.getJoinCode());
        return response;
    }

    public void joinRequest(String joinCode) {
        Community community = communityRepo.findByJoinCode(joinCode);
        if(community == null) {

            throw new RuntimeException(
                    "Community not found"
            );
        }
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String username = authentication.getName();
        User user = userRepo.findByUsername(username);
        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }
        if(community.getMemberId()
                .contains(user.getId())) {

            throw new RuntimeException("Already joined");
        }
        community.getMemberId().add(user.getId());
        user.getCommunityId()
                .add(community.getId());

        userRepo.save(user);
        communityRepo.save(community);
    }

    public String leave(String communityId) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String username = authentication.getName();
        User user = userRepo.findByUsername(username);
        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }
        Community community = communityRepo.findById(communityId).
                orElseThrow(()-> new RuntimeException("Invalid community"));
        if(Objects.equals(community.getAdminId(), user.getId())){
            throw new RuntimeException("Admin Cannot Leave");
        }
        if(!community.getMemberId()
                .contains(user.getId())) {

            throw new RuntimeException(
                    "User not in community"
            );
        }
        community.getMemberId().remove(user.getId());
        user.getCommunityId().remove(community.getId());
        userRepo.save(user);
        communityRepo.save(community);

        return "Community Left Successfully";
    }

    private ViewCommunity mapToViewCommunity(
            Community community
    ) {

        User admin = userRepo.findById(
                community.getAdminId()
        ).orElseThrow(() ->

                new RuntimeException(
                        "Admin not found"
                )
        );

        ViewCommunity response =
                new ViewCommunity();

        response.setId(community.getId());
        response.setName(
                community.getName()
        );

        response.setAdminName(
                admin.getName()
        );

        return response;
    }
    public List<ViewCommunity> viewAll() {
        List<Community> all= communityRepo.findAll();

        List<ViewCommunity> res = new ArrayList<>();
        for (int i = 0; i < all.size(); i++) {
            res.add(mapToViewCommunity(all.get(i)));

        }
        return res;
    }

    public List<ViewCommunity> myCommunities() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username =
                authentication.getName();

        User user =
                userRepo.findByUsername(username);

        List<Community> communities =
                communityRepo.findAllById(
                        user.getCommunityId()
                );

        return communities.stream()
                .map(this::mapToViewCommunity)
                .toList();
    }

    private CommunityDetails mapToCommunityDetails(
            Community community
    ) {

        User admin = userRepo.findById(
                community.getAdminId()
        ).orElseThrow(() ->

                new RuntimeException(
                        "Admin not found"
                )
        );

        List<MemberResponse> members =
                new ArrayList<>();

        for(String memberId :
                community.getMemberId()) {

            User member =
                    userRepo.findById(
                            memberId
                    ).orElseThrow(() ->

                            new RuntimeException(
                                    "Member not found"
                            )
                    );

            members.add(

                    new MemberResponse(
                            member.getName(),
                            member.getUsername()
                    )
            );
        }

        CommunityDetails response =
                new CommunityDetails();

        response.setName(
                community.getName()
        );

        response.setJoinCode(
                community.getJoinCode()
        );

        response.setAdminName(
                admin.getName()
        );

        response.setMemberCount(
                (long) community.getMemberId()
                        .size()
        );

        response.setMembers(
                members
        );

        return response;
    }
    public CommunityDetails Details(
            String communityId
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username =
                authentication.getName();

        User currentUser =
                userRepo.findByUsername(
                        username
                );

        if(currentUser == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        Community community =
                communityRepo.findById(
                        communityId
                ).orElseThrow(() ->

                        new RuntimeException(
                                "Invalid Community"
                        )
                );



        return mapToCommunityDetails(
                community
        );
    }
}
