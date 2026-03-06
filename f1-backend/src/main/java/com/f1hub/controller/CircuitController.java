package com.f1hub.controller;

import com.f1hub.model.Circuit;
import com.f1hub.repository.CircuitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/circuits")
@CrossOrigin
public class CircuitController {

    @Autowired
    private CircuitRepository circuitRepo;

    // ✅ FIX: absolute base directory (NO old logic removed)
    private static final String BASE_DIR =
            System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

    // ================= ADD CIRCUIT =================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Circuit addCircuit(
            @RequestParam String name,
            @RequestParam String country,
            @RequestParam String city,
            @RequestParam(required = false) MultipartFile trackImage,
            @RequestParam(required = false) String trackImageUrl,
            @RequestParam(required = false) MultipartFile trackOutline
    ) throws IOException {

        Circuit c = new Circuit();
        c.setName(name);
        c.setCountry(country);
        c.setCity(city);

        // ===== TRACK IMAGE =====
        if (trackImage != null && !trackImage.isEmpty()) {

            String fileName = System.currentTimeMillis() + "_" + trackImage.getOriginalFilename();

            File trackDir = new File(BASE_DIR + "tracks");
            trackDir.mkdirs();

            File dest = new File(trackDir, fileName);
            trackImage.transferTo(dest);

            c.setTrackImage("/uploads/tracks/" + fileName);

        } else if (trackImageUrl != null && !trackImageUrl.isEmpty()) {
            c.setTrackImage(trackImageUrl);
        }

        // ===== TRACK OUTLINE =====
        if (trackOutline != null && !trackOutline.isEmpty()) {

            String fileName = System.currentTimeMillis() + "_" + trackOutline.getOriginalFilename();

            File outlineDir = new File(BASE_DIR + "outlines");
            outlineDir.mkdirs();

            File dest = new File(outlineDir, fileName);
            trackOutline.transferTo(dest);

            c.setTrackOutline("/uploads/outlines/" + fileName);
        }

        return circuitRepo.save(c);
    }

    // ================= GET ALL =================
    @GetMapping
    public List<Circuit> getAllCircuits() {
        return circuitRepo.findAll();
    }

    // ================= UPDATE =================
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Circuit updateCircuit(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String country,
            @RequestParam String city,
            @RequestParam(required = false) MultipartFile trackImage,
            @RequestParam(required = false) String trackImageUrl,
            @RequestParam(required = false) MultipartFile trackOutline
    ) throws IOException {

        Circuit c = circuitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found"));

        c.setName(name);
        c.setCountry(country);
        c.setCity(city);

        // ===== UPDATE TRACK IMAGE =====
        if (trackImage != null && !trackImage.isEmpty()) {

            String fileName = System.currentTimeMillis() + "_" + trackImage.getOriginalFilename();

            File trackDir = new File(BASE_DIR + "tracks");
            trackDir.mkdirs();

            File dest = new File(trackDir, fileName);
            trackImage.transferTo(dest);

            c.setTrackImage("/uploads/tracks/" + fileName);

        } else if (trackImageUrl != null && !trackImageUrl.isEmpty()) {
            c.setTrackImage(trackImageUrl);
        }

        // ===== UPDATE TRACK OUTLINE =====
        if (trackOutline != null && !trackOutline.isEmpty()) {

            String fileName = System.currentTimeMillis() + "_" + trackOutline.getOriginalFilename();

            File outlineDir = new File(BASE_DIR + "outlines");
            outlineDir.mkdirs();

            File dest = new File(outlineDir, fileName);
            trackOutline.transferTo(dest);

            c.setTrackOutline("/uploads/outlines/" + fileName);
        }

        return circuitRepo.save(c);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void deleteCircuit(@PathVariable Long id) {
        circuitRepo.deleteById(id);
    }
}
