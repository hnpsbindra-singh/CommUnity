package com.testing.springpractice.community.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Id
    private String id;
    private String title;
    private String description;
    private String userId;
    private String communityId;
    private Long feelsGood = 0L;
    private List<String> feelGoodUserIds =
            new ArrayList<>();

}
