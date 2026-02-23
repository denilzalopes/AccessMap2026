package com.accessmap.authservice.services;

import com.accessmap.authservice.models.User;
import com.accessmap.authservice.models.Role;
import com.accessmap.authservice.repositories.UserRepository;
import com.accessmap.authservice.utils.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, String> register(String email, String password, String displayName) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(bCryptPasswordEncoder.encode(password));
        user.setDisplayName(displayName);
        user.setRole(Role.CONTRIBUTOR);
        user.setAccessibilityPrefs("{}"); // Default empty JSONB
        userRepository.save(user);

        return generateTokens(user);
    }

    public Map<String, String> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!bCryptPasswordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return generateTokens(user);
    }

    private Map<String, String> generateTokens(User user) {
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", jwtUtil.generateToken(user.getEmail(), user.getId().toString(), user.getRole().name(), jwtUtil.getExpiration()));
        tokens.put("refreshToken", jwtUtil.generateToken(user.getEmail(), user.getId().toString(), user.getRole().name(), jwtUtil.getRefreshExpiration()));
        return tokens;
    }

    public Map<String, String> refreshToken(String refreshToken) {
        if (jwtUtil.validateToken(refreshToken)) {
            String email = jwtUtil.extractUsername(refreshToken);
            String userId = jwtUtil.extractUserId(refreshToken);
            String role = jwtUtil.extractRole(refreshToken);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", jwtUtil.generateToken(email, userId, role, jwtUtil.getExpiration()));
            tokens.put("refreshToken", jwtUtil.generateToken(email, userId, role, jwtUtil.getRefreshExpiration()));
            return tokens;
        } else {
            throw new RuntimeException("Invalid refresh token");
        }
    }
}
