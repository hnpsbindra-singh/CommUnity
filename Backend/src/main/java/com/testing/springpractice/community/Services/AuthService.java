package com.testing.springpractice.community.Services;

import com.testing.springpractice.community.DTO.LoginRequest;
import com.testing.springpractice.community.DTO.RegisterRequest;
import com.testing.springpractice.community.DTO.RegisterResponse;
import com.testing.springpractice.community.Models.Role;
import com.testing.springpractice.community.Models.User;
import com.testing.springpractice.community.Repos.UserRepo;
import com.testing.springpractice.community.Security.JwtUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AuthService {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepo userRepo;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    EmailService emailService;

    public RegisterResponse Register(RegisterRequest registerRequest){
        User user = new User();
        if(userRepo.findByUsername(
                registerRequest.getUsername()
        ) != null) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }
        user = modelMapper.map(registerRequest, User.class);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.USER);
        user.setIsVerified(false);
        userRepo.save(user);
        return modelMapper.map(user, RegisterResponse.class);
    }

    public String login(LoginRequest loginRequest) {

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()));

            User user = userRepo.findByUsername(loginRequest.getUsername());
            if(user==null){
                throw new RuntimeException("User not Found");
            }
            if(!user.getIsVerified()){
                throw new RuntimeException("user not verified");
            }

        return jwtUtils.generateToken(loginRequest.getUsername(), user.getRole());

    }

    public String sendOtp(String username) {

        Random random = new Random();
        String otp = String.valueOf(100000 + random.nextInt(900000));
        String expiry = String.valueOf(System.currentTimeMillis() + (15*60*1000));
        User user = userRepo.findByUsername(username);
        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }
        user.setOtp(otp);
        user.setOtpExpiresAt(expiry);
        userRepo.save(user);

         emailService.sendOtp(username, otp);
        return "Otp Sent Successfully";
    }

    public String sendResetOtp(String username) {

        Random random = new Random();
        String otp = String.valueOf(100000 + random.nextInt(900000));
        String expiry = String.valueOf(System.currentTimeMillis() + (15*60*1000));
        User user = userRepo.findByUsername(username);
        if(user == null) {

            throw new RuntimeException(
                    "User not found"
            );
        }
        user.setOtp(otp);
        user.setOtpExpiresAt(expiry);
        userRepo.save(user);

        emailService.sendOtp(username, otp);
        return "Otp Sent Successfully";
    }

    public String verifyOtp(String username, String otp) {

        User user = userRepo.findByUsername(username);
        if(user==null){
            throw new RuntimeException("user not found");
        }
        if(user.getOtp() == null) {
            return "OTP not generated";
        }
        if(System.currentTimeMillis()>Long.parseLong(user.getOtpExpiresAt())){
            throw new RuntimeException("Otp expired");
        }
        if(!otp.equals(user.getOtp())){
            throw new RuntimeException("Incorrect Otp");
        }
        user.setIsVerified(true);
        user.setOtp(null);
        user.setOtpExpiresAt(null);

        userRepo.save(user);
        return "Verified Successfully";
    }

    public void resetPassword(String username,String Otp, String password){
        User user = userRepo.findByUsername(username);
        if(user==null){
            throw new RuntimeException("Invalid Username");
        }
        if(user.getOtp() == null) {
            throw new RuntimeException("OTP not generated");
        }
        if(System.currentTimeMillis()>Long.parseLong(user.getOtpExpiresAt())){
            throw new RuntimeException("Otp expired");
        }
        if(!Otp.equals(user.getOtp())){
            throw new RuntimeException("Incorrect Otp");
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setOtp(null);
        user.setOtpExpiresAt(null);

        userRepo.save(user);


    }
}
