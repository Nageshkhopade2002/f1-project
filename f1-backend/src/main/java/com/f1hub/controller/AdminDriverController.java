package com.f1hub.controller;

import com.f1hub.model.Driver;
import com.f1hub.model.Team;
import com.f1hub.service.DriverService;
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
@RequestMapping("/api/admin/drivers")
@CrossOrigin
public class AdminDriverController {

    private final DriverService driverService;
    private final TeamService teamService;

    private final String uploadDir = "uploads/drivers/";

    public AdminDriverController(DriverService driverService, TeamService teamService) {
        this.driverService = driverService;
        this.teamService = teamService;
    }

    // ========== CREATE DRIVER ==========
    @PostMapping
    public ResponseEntity<?> createDriver(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam Integer driverNumber,
            @RequestParam String nationality,
            @RequestParam(required = false) String bio,
            @RequestParam Long teamId,
            @RequestParam(required = false) MultipartFile profileImage
    ) {
        try {
            Driver driver = new Driver();
            driver.setFirstName(firstName);
            driver.setLastName(lastName);
            driver.setDriverNumber(driverNumber);
            driver.setNationality(nationality);
            driver.setBio(bio);

            Team team = teamService.getTeamById(teamId);
            driver.setTeam(team);

            if (profileImage != null && !profileImage.isEmpty()) {
                String imagePath = saveImage(profileImage);
                driver.setProfileImage(imagePath);
            }

            return ResponseEntity.ok(driverService.saveDriver(driver));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== UPDATE DRIVER ==========
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(
            @PathVariable Long id,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam Integer driverNumber,
            @RequestParam String nationality,
            @RequestParam(required = false) String bio,
            @RequestParam Long teamId,
            @RequestParam(required = false) MultipartFile profileImage
    ) {
        try {
            Driver driver = driverService.getDriverById(id);

            driver.setFirstName(firstName);
            driver.setLastName(lastName);
            driver.setDriverNumber(driverNumber);
            driver.setNationality(nationality);
            driver.setBio(bio);

            Team team = teamService.getTeamById(teamId);
            driver.setTeam(team);

            if (profileImage != null && !profileImage.isEmpty()) {
                deleteOldImage(driver.getProfileImage());
                String imagePath = saveImage(profileImage);
                driver.setProfileImage(imagePath);
            }

            return ResponseEntity.ok(driverService.saveDriver(driver));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== DELETE DRIVER ==========
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        try {
            Driver driver = driverService.getDriverById(id);
            deleteOldImage(driver.getProfileImage());
            driverService.deleteDriver(id);
            return ResponseEntity.ok("Driver deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== GET ALL DRIVERS (ADMIN) ==========
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
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
