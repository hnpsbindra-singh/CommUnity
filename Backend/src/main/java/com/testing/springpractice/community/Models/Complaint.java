package com.testing.springpractice.community.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Complaint {
    @Id
    private String id;
    private ComplaintType title;
    private String description;
    private ComplaintStatus status;
    private String authorId;
    @Indexed
    private String societyId;

}
