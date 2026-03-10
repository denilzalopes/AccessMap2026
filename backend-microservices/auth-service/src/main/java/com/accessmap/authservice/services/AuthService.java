package com.accessmap.authservice.services;

import com.accessmap.authservice.dto.AuthResponse;
import com.accessmap.authservice.models.Role;
import com.accessmap.authservice.models.User;
import com.accessmap.authservice.repositories.UserRepository;
import com.accessmap.authservice.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service d'authentification — inscription, connexion, refresh token.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Inscription d'un nouvel utilisateur.
     * Vérifie l'unicité de l'email avant de persister.
     */
    @Transactional
    public AuthResponse register(String email, String password, String displayName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Un compte avec cet email existe déjà");
        }

        User user = new User();
        user.setEmail(email.toLowerCase().trim());
        user.setPasswordHash(bCryptPasswordEncoder.encode(password));
        user.setDisplayName(displayName);
        user.setRole(Role.CONTRIBUTOR);

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    /**
     * Connexion — vérifie les credentials et retourne un pair de tokens.
     */
    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Identifiants invalides"));

        if (!bCryptPasswordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Identifiants invalides");
        }

        return buildAuthResponse(user);
    }

    /**
     * Rafraîchit l'access token à partir d'un refresh token valide.
     */
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Refresh token invalide ou expiré");
        }

        String email = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return buildAuthResponse(user);
    }

    /** Construit la réponse JWT complète pour un utilisateur. */
    private AuthResponse buildAuthResponse(User user) {
        String userId = user.getId().toString();
        String role = user.getRole().name();

        return AuthResponse.builder()
                .accessToken(jwtUtil.generateToken(user.getEmail(), userId, role, jwtUtil.getExpiration()))
                .refreshToken(jwtUtil.generateToken(user.getEmail(), userId, role, jwtUtil.getRefreshExpiration()))
                .userId(userId)
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(role)
                .build();
    }
}
