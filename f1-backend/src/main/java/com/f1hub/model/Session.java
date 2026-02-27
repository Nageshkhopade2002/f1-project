package com.f1hub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;




@Getter
@Setter

@Entity
@Table(name = "session")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "race_event_id")
    private RaceEvent raceEvent;

    private String sessionName; // FP1, FP2, QUALI, RACE
    private LocalDateTime startTimeUtc;
    private LocalDateTime endTimeUtc;

    private String status = "TBC";

    // getters & setters
}
