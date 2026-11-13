package in.arnabkhan.multitenant.auth.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import in.arnabkhan.multitenant.auth.dto.UsernameExistsResponse;
import in.arnabkhan.multitenant.auth.dto.AddUserInput;
import in.arnabkhan.multitenant.auth.entity.User;
import in.arnabkhan.multitenant.auth.service.AuthService;

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
    public User addUser(@Argument("input") AddUserInput input) {
        return authService.addUser(input);
    }
}
