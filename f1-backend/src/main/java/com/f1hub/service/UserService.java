package com.f1hub.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.f1hub.model.Role;
import com.f1hub.model.User;
import com.f1hub.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public void deleteUser(Long id) {
        repo.deleteById(id);
    }

    public User updateRole(Long id, Role role) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return repo.save(user);
    }

    // ✅ ADD USER
    public User createUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    // ✅ UPDATE USER
    public User updateUser(Long id, String email, String password) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(email);

        if (password != null && !password.isEmpty()) {
            user.setPassword(encoder.encode(password));
        }

        return repo.save(user);
    }
    public Map<String, Long> getUserStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", repo.count());
        stats.put("admin", repo.countByRole(Role.ADMIN));
        stats.put("user", repo.countByRole(Role.USER));
        return stats;
    }

}
