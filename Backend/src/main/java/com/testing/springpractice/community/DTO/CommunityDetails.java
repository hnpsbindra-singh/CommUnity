package com.testing.springpractice.community.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommunityDetails {
    private String name;
    private String joinCode;
    private String adminName;
    private Long memberCount;
    private List<MemberResponse> members;
}
