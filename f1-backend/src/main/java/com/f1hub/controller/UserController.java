package com.f1hub.controller;

import com.f1hub.model.Role;
import com.f1hub.model.User;
import com.f1hub.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
    }

    @PutMapping("/{id}/role")
    public User updateRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {
        return service.updateRole(id, role);
    }
    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.createUser(user);
    }
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ) {
        return service.updateUser(id, user.getEmail(), user.getPassword());
    }
    @GetMapping("/stats")
    public Map<String, Long> getUserStats() {
        return service.getUserStats();
    }


}
