package com.example.movieapi;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final JwtUtil jwtUtil;

    // Simulated database (Replace with actual DB lookup)
    private static final Map<String, String> USERS = new HashMap<>();
    private static final Map<String, String> ROLES = new HashMap<>();

    static {
        USERS.put("admin", "password");
        USERS.put("user", "user123");

        ROLES.put("admin", "ADMIN");
        ROLES.put("user", "USER");
    }

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // 🔹 Login Endpoint
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        if (USERS.containsKey(username) && USERS.get(username).equals(password)) {
            String role = ROLES.get(username);
            String token = jwtUtil.generateToken(username, role);
            return new AuthResponse(token, role);
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    // 🔹 Register Endpoint (Modified)
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody AuthRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
            throw new RuntimeException("Username and Password cannot be empty");
        }

        if (USERS.containsKey(username)) {
            throw new RuntimeException("User already exists");
        }

        USERS.put(username, password);
        ROLES.put(username, "USER"); // Default role as USER

        String token = jwtUtil.generateToken(username, "USER");

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("token", token);
        return response;
    }
}
