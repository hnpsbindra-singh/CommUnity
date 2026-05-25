package com.testing.springpractice.community.DTO;

import com.testing.springpractice.community.Models.ComplaintStatus;
import com.testing.springpractice.community.Models.ComplaintType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintRequest {
    private ComplaintType title;
    private String description;
    private ComplaintStatus status;

}
