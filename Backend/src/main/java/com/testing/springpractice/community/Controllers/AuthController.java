package com.testing.springpractice.community.Controllers;

import com.testing.springpractice.community.DTO.LoginRequest;
import com.testing.springpractice.community.DTO.RegisterRequest;
import com.testing.springpractice.community.DTO.RegisterResponse;
import com.testing.springpractice.community.DTO.ResetPasswordRequest;
import com.testing.springpractice.community.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/register")
    public RegisterResponse Register(@RequestBody RegisterRequest registerRequest){
        return authService.Register(registerRequest);
    }
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String username){
        return authService.sendOtp(username);
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String Otp, @RequestParam String username){
        return authService.verifyOtp(username, Otp);
    }

    @PostMapping("/send-reset-otp")
    public void sendResetotp(@RequestParam String username){
        try {
            authService.sendResetOtp(username);
        }
        catch (Exception e){
            e.printStackTrace();
        }

    }

    @PostMapping("/reset-password")
    public void resetpassword(@RequestBody ResetPasswordRequest resetPasswordRequest){
        authService.resetPassword(resetPasswordRequest.getUsername(), resetPasswordRequest.getOtp(), resetPasswordRequest.getNewPassword());
    }

}
