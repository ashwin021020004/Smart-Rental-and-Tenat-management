package com.smartrental;

import com.smartrental.entity.User;
import com.smartrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            userRepository.save(new User("admin", encoder.encode("admin123"), "ADMIN"));
            userRepository.save(new User("user", encoder.encode("user123"), "USER"));
            System.out.println("Default users created: admin/admin123 (ADMIN), user/user123 (USER)");
        }
        // No sample rooms - admin will add rooms manually through the UI
        System.out.println("Room management initialized - admin can add rooms through the UI");
    }
}
