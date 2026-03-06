package com.f1hub.repository;

import com.f1hub.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    // 🔹 For homepage (Top 3)
    Page<News> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 🔹 For admin panel (full list)
    List<News> findAllByOrderByCreatedAtDesc();
}
