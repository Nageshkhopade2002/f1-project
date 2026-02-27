package com.f1hub.controller;

import com.f1hub.model.RaceEvent;
import com.f1hub.model.Session;
import com.f1hub.repository.RaceEventRepository;
import com.f1hub.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sessions")
@CrossOrigin
public class SessionController {

    @Autowired
    private SessionRepository sessionRepo;

    @Autowired
    private RaceEventRepository raceRepo;

    @PostMapping
    public Session addSession(@RequestBody Map<String, String> req) {

        Long raceEventId = Long.parseLong(req.get("raceEventId"));

        RaceEvent raceEvent = raceRepo.findById(raceEventId)
                .orElseThrow(() -> new RuntimeException("Race not found"));

        Session s = new Session();
        s.setSessionName(req.get("sessionName"));
        s.setStatus(req.getOrDefault("status", "TBC"));
        s.setRaceEvent(raceEvent);

        return sessionRepo.save(s);
    }

    @GetMapping("/{raceId}")
    public List<Session> getSessionsByRace(@PathVariable Long raceId) {
        return sessionRepo.findByRaceEvent_Id(raceId);
    }

    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        sessionRepo.deleteById(id);
    }
}
