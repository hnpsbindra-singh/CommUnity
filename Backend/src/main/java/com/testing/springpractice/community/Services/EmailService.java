package com.testing.springpractice.community.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public String sendOtp(String username, String otp) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(username);
        mailMessage.setSubject("Here is Your otp");
        mailMessage.setText(
                "Hi,\n\n" +

                        "Your CommUnity verification code is:\n\n" +

                        otp + "\n\n" +

                        "— Team CommUnity"
        );
        mailSender.send(mailMessage);
        return "OTP Sent Successfully";
    }
}
