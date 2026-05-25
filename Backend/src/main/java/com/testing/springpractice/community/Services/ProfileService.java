package com.testing.springpractice.community.Services;

import com.testing.springpractice.community.DTO.RegisterResponse;
import com.testing.springpractice.community.DTO.UpdateProfileRequest;
import com.testing.springpractice.community.Models.User;
import com.testing.springpractice.community.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    @Autowired
    UserRepo userRepo;
    public RegisterResponse getDetails() {
        Authentication authentication = SecurityContextHolder.
                getContext().
                getAuthentication();
        String username = authentication.getName();
        User user = userRepo.findByUsername(username);
        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }
        return maptoRegisterResponse(user);
    }

    private RegisterResponse maptoRegisterResponse(User user) {
        RegisterResponse registerResponse= new RegisterResponse();
        registerResponse.setMobile(user.getMobile());
        registerResponse.setName(user.getName());
        registerResponse.setRole(user.getRole());
        registerResponse.setUsername(user.getUsername());
        registerResponse.setId(user.getId());
        return registerResponse;

    }



    public RegisterResponse updateProfile(
            UpdateProfileRequest request
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

        user.setName(
                request.getName()
        );

        user.setMobile(
                request.getMobile()
        );

        User savedUser =
                userRepo.save(user);

        return maptoRegisterResponse(savedUser);
    }
}
