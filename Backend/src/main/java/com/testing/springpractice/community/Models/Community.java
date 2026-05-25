package com.testing.springpractice.community.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Community {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String joinCode;
    private String adminId;
    private List<String> memberId = new ArrayList<>();

}