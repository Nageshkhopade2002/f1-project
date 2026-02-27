package com.f1hub.controller;

import com.f1hub.dto.NewsDto;
import com.f1hub.service.NewsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:3000")
public class NewsController {

    private final NewsService service;

    public NewsController(NewsService service) {
        this.service = service;
    }

    @GetMapping("/top3")
    public List<NewsDto> top3() {
        return service.getTop3Latest().stream()
                .map(n -> new NewsDto(
                        n.getId(),
                        n.getTitle(),
                        n.getDescription(),
                        n.getImageUrl(),
                        n.getSource(),
                        n.getCreatedAt().toString()
                ))
                .toList();
    }
    
    @GetMapping("/all")
    public List<NewsDto> all() {
        return service.getAll().stream()
                .map(n -> new NewsDto(
                        n.getId(),
                        n.getTitle(),
                        n.getDescription(),
                        n.getImageUrl(),
                        n.getSource(),
                        n.getCreatedAt().toString()
                ))
                .toList();
    }
}
