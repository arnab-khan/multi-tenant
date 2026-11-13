package in.arnabkhan.multitenant.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;

import in.arnabkhan.multitenant.auth.dto.AddUserInput;
import in.arnabkhan.multitenant.auth.entity.User;
import in.arnabkhan.multitenant.auth.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User addUser(AddUserInput input) {
        if (input == null || input.name() == null || input.name().isBlank()
                || input.username() == null || input.username().isBlank()
                || input.password() == null || input.password().isBlank()) {
            throw new IllegalArgumentException("Name, username and password are required");
        }

        String name = input.name().trim();
        String username = input.username().trim();

        if (name.length() > 100 || username.length() > 100) {
            throw new IllegalArgumentException("Name or username exceeds the allowed length");
        }
        if (input.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Password must not exceed 72 bytes");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken");
        }

        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(input.password()));
        return userRepository.save(user);
    }
}
