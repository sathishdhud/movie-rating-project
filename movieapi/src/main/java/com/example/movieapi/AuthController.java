package com.example.movieapi;

import com.example.movieapi.user.model.User;
import com.example.movieapi.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // 🔹 Login Endpoint - Updated to use database
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        Optional<User> userOptional = userService.findByUsername(username);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Validate password
            if (userService.validatePassword(password, user.getPassword())) {
                String token = jwtUtil.generateToken(username, user.getRole());
                return new AuthResponse(token, user.getRole());
            }
        }
        
        throw new RuntimeException("Invalid credentials");
    }

    // 🔹 Register Endpoint - Updated to save to database
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody AuthRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        if (username == null || password == null || username.trim().isEmpty() || password.trim().isEmpty()) {
            throw new RuntimeException("Username and Password cannot be empty");
        }

        try {
            // Save user to database
            User newUser = userService.registerUser(username, password);
            
            // Generate token for the new user
            String token = jwtUtil.generateToken(username, newUser.getRole());

            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("token", token);
            response.put("role", newUser.getRole());
            return response;
            
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    
    // 🔹 Initialize Admin User (Optional endpoint for testing)
    @PostMapping("/init-admin")
    public Map<String, String> initializeAdmin() {
        try {
            User admin = userService.createAdminUser();
            Map<String, String> response = new HashMap<>();
            if (admin != null) {
                response.put("message", "Admin user created successfully");
                response.put("username", "admin");
                response.put("password", "password");
            } else {
                response.put("message", "Admin user already exists");
            }
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create admin user: " + e.getMessage());
        }
    }
}