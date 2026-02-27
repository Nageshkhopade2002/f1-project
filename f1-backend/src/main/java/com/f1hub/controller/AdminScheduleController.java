package com.f1hub.controller;

import com.f1hub.model.*;
import com.f1hub.repository.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/schedule")
@CrossOrigin
public class AdminScheduleController {

    private final SeasonRepository seasonRepo;
    private final CircuitRepository circuitRepo;
    private final RaceEventRepository raceRepo;
    private final SessionRepository sessionRepo;

    public AdminScheduleController(
            SeasonRepository seasonRepo,
            CircuitRepository circuitRepo,
            RaceEventRepository raceRepo,
            SessionRepository sessionRepo) {
        this.seasonRepo = seasonRepo;
        this.circuitRepo = circuitRepo;
        this.raceRepo = raceRepo;
        this.sessionRepo = sessionRepo;
    }

    @PostMapping("/season")
    public Season addSeason(@RequestBody Season s) {
        return seasonRepo.save(s);
    }

    @PostMapping("/circuit")
    public Circuit addCircuit(@RequestBody Circuit c) {
        return circuitRepo.save(c);
    }

    @PostMapping("/race")
    public RaceEvent addRace(@RequestBody RaceEvent r) {
        return raceRepo.save(r);
    }

    @PostMapping("/session")
    public Session addSession(@RequestBody Session s) {
        return sessionRepo.save(s);
    }
    
    @GetMapping("/races")
    public Object getAllRaces() {
        return raceRepo.findAll();
    }
    @PutMapping("/race/{id}")
    public RaceEvent updateRace(
            @PathVariable Long id,
            @RequestBody RaceEvent updatedRace
    ) {
        RaceEvent race = raceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Race not found"));

        race.setRaceName(updatedRace.getRaceName());
        race.setRoundNumber(updatedRace.getRoundNumber());
        race.setEventType(updatedRace.getEventType());
        race.setStatus(updatedRace.getStatus());

        return raceRepo.save(race);
    }

    @DeleteMapping("/race/{id}")
    public void deleteRace(@PathVariable Long id) {
        if (!raceRepo.existsById(id)) {
            throw new RuntimeException("Race not found");
        }
        raceRepo.deleteById(id);
    }

}
