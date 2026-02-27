package com.f1hub.service;

import com.f1hub.model.*;
import com.f1hub.repository.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ScheduleService {

    private final RaceEventRepository raceRepo;
    private final SessionRepository sessionRepo;

    public ScheduleService(RaceEventRepository raceRepo, SessionRepository sessionRepo) {
        this.raceRepo = raceRepo;
        this.sessionRepo = sessionRepo;
    }

    public List<RaceEvent> getSeasonSchedule(int year) {
        return raceRepo.findBySeason_Year(year);
    }

    public Map<String, Object> getRaceDetails(Long raceId) {
        RaceEvent race = raceRepo.findById(raceId).orElseThrow();
        List<Session> sessions = sessionRepo.findByRaceEvent_Id(raceId);

        Map<String, Object> response = new HashMap<>();
        response.put("race", race);
        response.put("sessions", sessions);
        response.put("circuit", race.getCircuit());

        return response;
    }
}
