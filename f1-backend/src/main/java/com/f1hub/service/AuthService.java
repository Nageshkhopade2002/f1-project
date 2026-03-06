package com.f1hub.service;

import com.f1hub.model.Role;
import com.f1hub.model.User;
import com.f1hub.repository.UserRepository;
import com.f1hub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwt;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        repo.save(user);
        return "User Registered Successfully";
    }

    public String login(String email, String password) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return jwt.generateToken(user.getEmail(), user.getRole().name());
    }
}
