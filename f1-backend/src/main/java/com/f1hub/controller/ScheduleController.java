package com.f1hub.controller;

import com.f1hub.service.ScheduleService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin
public class ScheduleController {

    private final ScheduleService service;

    public ScheduleController(ScheduleService service) {
        this.service = service;
    }

    @GetMapping("/{year}")
    public Object getSchedule(@PathVariable int year) {
        return service.getSeasonSchedule(year);
    }

    @GetMapping("/race/{id}")
    public Object getRaceDetails(@PathVariable Long id) {
        return service.getRaceDetails(id);
    }
}
