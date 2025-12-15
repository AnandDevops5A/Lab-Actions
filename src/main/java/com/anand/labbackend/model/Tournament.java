package com.anand.labbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "tournaments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class Tournament {
    @Id
    private String id;

    private String name;
    private String description;
    private String date;
    private Integer participants;
}
