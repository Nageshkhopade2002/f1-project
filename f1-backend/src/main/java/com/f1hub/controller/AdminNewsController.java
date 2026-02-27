package com.f1hub.controller;

import com.f1hub.model.News;
import com.f1hub.service.NewsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminNewsController {

    private final NewsService service;

    public AdminNewsController(NewsService service) {
        this.service = service;
    }

    // ================= GET ALL NEWS =================
    @GetMapping
    public List<News> getAll() {
        return service.getAll();
    }

    // ================= ADD NEWS =================
    @PostMapping(consumes = "multipart/form-data")
    public News add(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String source,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String imageUrl
    ) {
        return service.add(title, description, source, image, imageUrl);
    }

    // ================= UPDATE NEWS =================
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public News update(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String source,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String imageUrl
    ) {
        return service.update(id, title, description, source, image, imageUrl);
    }

    // ================= DELETE NEWS =================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
