package in.arnabkhan.multitenant.auth.dto;

import in.arnabkhan.multitenant.auth.entity.User;

public record LoginResponse(boolean success, String message, User user) {}
