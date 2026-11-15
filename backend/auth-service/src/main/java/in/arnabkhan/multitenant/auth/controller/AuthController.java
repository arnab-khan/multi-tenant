package in.arnabkhan.multitenant.auth.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import in.arnabkhan.multitenant.auth.dto.UsernameExistsResponse;
import in.arnabkhan.multitenant.auth.dto.AddUserInput;
import in.arnabkhan.multitenant.auth.dto.LoginInput;
import in.arnabkhan.multitenant.auth.dto.LoginResponse;
import in.arnabkhan.multitenant.auth.entity.User;
import in.arnabkhan.multitenant.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @QueryMapping
    public UsernameExistsResponse usernameExists(@Argument String username) {
        return new UsernameExistsResponse(authService.usernameExists(username));
    }

    @MutationMapping
    public LoginResponse login(@Argument("input") LoginInput input,
            @ContextValue("servletRequest") HttpServletRequest request) {
        LoginResponse response = authService.login(input);
        if (response.success()) {
            // Tomcat creates the session and sends its ID in the JSESSIONID cookie.
            var session = request.getSession(true);
            // Rotate an existing session ID after successful credential verification.
            request.changeSessionId();
            session.setAttribute("userId", response.user().getId());
        }
        return response;
    }

    @QueryMapping
    public User me(@ContextValue("servletRequest") HttpServletRequest request) {
        var session = request.getSession(false);
        if (session == null || !(session.getAttribute("userId") instanceof Long userId)) {
            return null;
        }
        return authService.findUserById(userId);
    }

    @MutationMapping
    public boolean logout(@ContextValue("servletRequest") HttpServletRequest request) {
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return true;
    }

    @MutationMapping
    public User addUser(@Argument("input") AddUserInput input) {
        return authService.addUser(input);
    }
}
