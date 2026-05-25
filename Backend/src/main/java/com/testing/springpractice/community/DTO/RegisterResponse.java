package com.testing.springpractice.community.DTO;

import com.testing.springpractice.community.Models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private String id;
    private String name;
    private String username;
    private Role role;
    private String mobile;
}
