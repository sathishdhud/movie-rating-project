package com.example.movieapi.config;

import com.example.movieapi.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if it doesn't exist
        try {
            userService.createAdminUser();
            System.out.println("✅ Default admin user initialized (username: admin, password: password)");
        } catch (Exception e) {
            System.out.println("⚠️ Admin user already exists or failed to create: " + e.getMessage());
        }
    }
}