package com.f1hub.controller;

import com.f1hub.model.Team;
import com.f1hub.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/teams")
@CrossOrigin
public class AdminTeamController {

    private final TeamService teamService;

    private final String uploadDir = "uploads/teams/";

    public AdminTeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // ========== CREATE TEAM ==========
    @PostMapping
    public ResponseEntity<?> createTeam(
            @RequestParam String name,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String base,
            @RequestParam(required = false) String teamChief,
            @RequestParam(required = false) String technicalChief,
            @RequestParam(required = false) String powerUnit,
            @RequestParam(required = false) Integer firstEntryYear,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile logoImage,
            @RequestParam(required = false) MultipartFile carImage
    ) {
        try {
            Team team = new Team();
            team.setName(name);
            team.setFullName(fullName);
            team.setBase(base);
            team.setTeamChief(teamChief);
            team.setTechnicalChief(technicalChief);
            team.setPowerUnit(powerUnit);
            team.setFirstEntryYear(firstEntryYear);
            team.setDescription(description);

            if (logoImage != null && !logoImage.isEmpty()) {
                String logoPath = saveImage(logoImage);
                team.setLogoImage(logoPath);
            }

            if (carImage != null && !carImage.isEmpty()) {
                String carPath = saveImage(carImage);
                team.setCarImage(carPath);
            }

            return ResponseEntity.ok(teamService.saveTeam(team));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== UPDATE TEAM ==========
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeam(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String base,
            @RequestParam(required = false) String teamChief,
            @RequestParam(required = false) String technicalChief,
            @RequestParam(required = false) String powerUnit,
            @RequestParam(required = false) Integer firstEntryYear,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile logoImage,
            @RequestParam(required = false) MultipartFile carImage
    ) {
        try {
            Team team = teamService.getTeamById(id);

            team.setName(name);
            team.setFullName(fullName);
            team.setBase(base);
            team.setTeamChief(teamChief);
            team.setTechnicalChief(technicalChief);
            team.setPowerUnit(powerUnit);
            team.setFirstEntryYear(firstEntryYear);
            team.setDescription(description);

            if (logoImage != null && !logoImage.isEmpty()) {
                deleteOldImage(team.getLogoImage());
                String logoPath = saveImage(logoImage);
                team.setLogoImage(logoPath);
            }

            if (carImage != null && !carImage.isEmpty()) {
                deleteOldImage(team.getCarImage());
                String carPath = saveImage(carImage);
                team.setCarImage(carPath);
            }

            return ResponseEntity.ok(teamService.saveTeam(team));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== DELETE TEAM ==========
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        try {
            Team team = teamService.getTeamById(id);

            deleteOldImage(team.getLogoImage());
            deleteOldImage(team.getCarImage());

            teamService.deleteTeam(id);

            return ResponseEntity.ok("Team deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== GET ALL TEAMS (ADMIN) ==========
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    // ========== IMAGE SAVE ==========
    private String saveImage(MultipartFile file) throws Exception {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + fileName);
        Files.write(path, file.getBytes());

        return uploadDir + fileName;
    }

    // ========== DELETE OLD IMAGE ==========
    private void deleteOldImage(String imagePath) {
        try {
            if (imagePath != null) {
                File file = new File(imagePath);
                if (file.exists()) {
                    file.delete();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
