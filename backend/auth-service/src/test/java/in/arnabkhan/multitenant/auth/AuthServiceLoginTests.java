package in.arnabkhan.multitenant.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import in.arnabkhan.multitenant.auth.dto.LoginInput;
import in.arnabkhan.multitenant.auth.entity.User;
import in.arnabkhan.multitenant.auth.repository.UserRepository;
import in.arnabkhan.multitenant.auth.service.AuthService;

class AuthServiceLoginTests {
    private final UserRepository repository = mock(UserRepository.class);
    private final AuthService service = new AuthService(repository);

    @Test
    void acceptsMatchingPasswordHash() {
        User user = new User();
        user.setUsername("arnab");
        user.setPasswordHash(new BCryptPasswordEncoder().encode("test-password"));
        when(repository.findByUsername("arnab")).thenReturn(Optional.of(user));

        var result = service.login(new LoginInput("arnab", "test-password"));

        assertTrue(result.success());
        assertSame(user, result.user());
    }

    @Test
    void rejectsWrongPasswordAndUnknownUsernameWithSameMessage() {
        User user = new User();
        user.setPasswordHash(new BCryptPasswordEncoder().encode("test-password"));
        when(repository.findByUsername("arnab")).thenReturn(Optional.of(user));
        when(repository.findByUsername("unknown")).thenReturn(Optional.empty());

        var wrongPassword = service.login(new LoginInput("arnab", "wrong-password"));
        var unknownUser = service.login(new LoginInput("unknown", "wrong-password"));

        assertFalse(wrongPassword.success());
        assertFalse(unknownUser.success());
        assertNull(wrongPassword.user());
        assertNull(unknownUser.user());
        assertEquals(wrongPassword.message(), unknownUser.message());
    }

    @Test
    void rejectsMissingCredentialsWithoutQueryingDatabase() {
        assertFalse(service.login(new LoginInput("", "")).success());
        verifyNoInteractions(repository);
    }
}
