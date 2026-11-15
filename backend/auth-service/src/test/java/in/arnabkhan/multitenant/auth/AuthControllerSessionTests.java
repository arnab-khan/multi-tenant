package in.arnabkhan.multitenant.auth;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;

import in.arnabkhan.multitenant.auth.controller.AuthController;
import in.arnabkhan.multitenant.auth.dto.LoginInput;
import in.arnabkhan.multitenant.auth.dto.LoginResponse;
import in.arnabkhan.multitenant.auth.entity.User;
import in.arnabkhan.multitenant.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

class AuthControllerSessionTests {
    @Test
    void logoutInvalidatesExistingSession() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);

        assertTrue(new AuthController(mock(AuthService.class)).logout(request));
        verify(session).invalidate();
    }

    @Test
    void logoutWithoutSessionDoesNotCreateOne() {
        HttpServletRequest request = mock(HttpServletRequest.class);

        assertTrue(new AuthController(mock(AuthService.class)).logout(request));
        verify(request).getSession(false);
        verifyNoMoreInteractions(request);
    }
    @Test
    void createsSessionOnlyAfterSuccessfulLogin() {
        AuthService service = mock(AuthService.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        LoginInput input = new LoginInput("arnab", "password");
        User user = new User();
        user.setId(1L);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(true)).thenReturn(session);
        LoginResponse response = new LoginResponse(true, "Login successful", user);
        when(service.login(input)).thenReturn(response);

        assertSame(response, new AuthController(service).login(input, request));

        verify(request).getSession(true);
        verify(request).changeSessionId();
        verify(session).setAttribute("userId", 1L);
    }

    @Test
    void doesNotCreateSessionForInvalidCredentials() {
        AuthService service = mock(AuthService.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        LoginInput input = new LoginInput("arnab", "wrong-password");
        when(service.login(input)).thenReturn(new LoginResponse(false, "Invalid username or password", null));

        new AuthController(service).login(input, request);

        verifyNoInteractions(request);
    }

    @Test
    void meReturnsNullWithoutCreatingSession() {
        AuthService service = mock(AuthService.class);
        HttpServletRequest request = mock(HttpServletRequest.class);

        assertNull(new AuthController(service).me(request));

        verify(request).getSession(false);
        verifyNoMoreInteractions(request);
        verifyNoInteractions(service);
    }

    @Test
    void meReturnsNullForSessionWithoutLogin() {
        AuthService service = mock(AuthService.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getSession(false)).thenReturn(mock(HttpSession.class));

        assertNull(new AuthController(service).me(request));
        verifyNoInteractions(service);
    }

    @Test
    void meReturnsUserIdentifiedBySession() {
        AuthService service = mock(AuthService.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        User user = new User();
        user.setId(1L);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("userId")).thenReturn(1L);
        when(service.findUserById(1L)).thenReturn(user);

        assertSame(user, new AuthController(service).me(request));
    }
}
