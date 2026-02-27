package com.f1hub.dto;

public class NewsDto {

    public Long id;
    public String title;
    public String description;
    public String imageUrl;
    public String source;
    public String createdAt;

    public NewsDto(Long id, String title, String description,
                   String imageUrl, String source, String createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.source = source;
        this.createdAt = createdAt;
    }
}
