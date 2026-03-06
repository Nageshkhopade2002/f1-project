package com.f1hub.service;

import com.f1hub.model.News;
import com.f1hub.repository.NewsRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NewsService {

    private final NewsRepository repo;

    // ✅ PROJECT-INTERNAL upload folder
    // This will create: <project-root>/uploads/news
    private final Path IMAGE_DIR = Paths.get("uploads/news");

    public NewsService(NewsRepository repo) {
        this.repo = repo;
    }

    // ================= ADD NEWS =================
    public News add(String title, String desc, String source,
                    MultipartFile image, String imageUrl) {

        try {
            Files.createDirectories(IMAGE_DIR);

            News news = new News();
            news.setTitle(title);
            news.setDescription(desc);
            news.setSource(source);
            news.setCreatedAt(LocalDateTime.now());

            handleImage(news, image, imageUrl);

            return repo.save(news);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("NEWS ADD FAILED");
        }
    }

    // ================= GET ALL NEWS (ADMIN) =================
    public List<News> getAll() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    // ================= UPDATE NEWS =================
    public News update(Long id, String title, String desc, String source,
                       MultipartFile image, String imageUrl) {

        try {
            News news = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("News not found"));

            news.setTitle(title);
            news.setDescription(desc);
            news.setSource(source);

            handleImage(news, image, imageUrl);

            return repo.save(news);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("NEWS UPDATE FAILED");
        }
    }

    // ================= DELETE =================
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // ================= HOME PAGE (TOP 3) =================
    public List<News> getTop3Latest() {
        return repo.findAllByOrderByCreatedAtDesc(
                org.springframework.data.domain.PageRequest.of(0, 3)
        ).getContent();
    }

    // ================= IMAGE HANDLER (REUSABLE) =================
    private void handleImage(News news, MultipartFile image, String imageUrl) throws Exception {

        Files.createDirectories(IMAGE_DIR);

        // ✅ Upload from PC
        if (image != null && !image.isEmpty()) {

            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = IMAGE_DIR.resolve(fileName);

            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // ✅ URL saved in DB
            news.setImageUrl("/uploads/news/" + fileName);
        }

        // ✅ External Image URL
        else if (imageUrl != null && !imageUrl.isBlank()) {
            news.setImageUrl(imageUrl);
        }

        // ✅ else: keep existing image (important for UPDATE)
    }
}
