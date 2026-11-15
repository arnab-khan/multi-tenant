package in.arnabkhan.multitenant.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;

import in.arnabkhan.multitenant.auth.dto.AddUserInput;
import in.arnabkhan.multitenant.auth.dto.LoginInput;
import in.arnabkhan.multitenant.auth.dto.LoginResponse;
import in.arnabkhan.multitenant.auth.entity.User;
import in.arnabkhan.multitenant.auth.entity.Role;
import in.arnabkhan.multitenant.auth.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final String dummyPasswordHash = passwordEncoder.encode("unused-login-password");

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginInput input) {
        if (input == null || input.username() == null || input.username().isBlank()
                || input.password() == null || input.password().isBlank()
                || input.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            return new LoginResponse(false, "Invalid username or password", null);
        }

        User user = userRepository.findByUsername(input.username().trim()).orElse(null);
        boolean passwordMatches = passwordEncoder.matches(input.password(),
                user == null ? dummyPasswordHash : user.getPasswordHash());
        if (user == null || !passwordMatches) {
            return new LoginResponse(false, "Invalid username or password", null);
        }

        return new LoginResponse(true, "Login successful", user);
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
        user.setRole(Role.USER);
        user.setPasswordHash(passwordEncoder.encode(input.password()));
        return userRepository.save(user);
    }
}
