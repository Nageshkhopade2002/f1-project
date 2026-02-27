package com.f1hub.repository;

import com.f1hub.model.Role;
import com.f1hub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Updated repository - no username field
public interface UserRepository extends JpaRepository<User, Long> {
	long countByRole(Role role);
    Optional<User> findByEmail(String email);

}