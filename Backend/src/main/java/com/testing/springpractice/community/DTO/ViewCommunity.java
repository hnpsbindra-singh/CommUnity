package com.testing.springpractice.community.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewCommunity {
    private String id;
    private String name;
    private String adminName;
}

