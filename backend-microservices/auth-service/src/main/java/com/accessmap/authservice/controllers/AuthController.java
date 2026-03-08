package com.accessmap.authservice.controllers;

<<<<<<< HEAD
import com.accessmap.authservice.dto.AuthResponse;
import com.accessmap.authservice.dto.LoginRequest;
import com.accessmap.authservice.dto.RefreshTokenRequest;
import com.accessmap.authservice.dto.RegisterRequest;
import com.accessmap.authservice.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST — endpoints d'authentification AccessMap.
 * Toutes les routes sont publiques (voir SecurityConfig).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Inscription, connexion et refresh token")
=======
import com.accessmap.authservice.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
public class AuthController {

    private final AuthService authService;

<<<<<<< HEAD
    /**
     * POST /api/auth/register
     * Inscription d'un nouvel utilisateur avec rôle CONTRIBUTOR par défaut.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Inscription", description = "Crée un compte et retourne les tokens JWT")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(
                request.getEmail(),
                request.getPassword(),
                request.getDisplayName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Connexion avec email/mot de passe.
     */
    @PostMapping("/login")
    @Operation(summary = "Connexion", description = "Authentifie un utilisateur et retourne les tokens")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request.getEmail(), request.getPassword()));
    }

    /**
     * POST /api/auth/refresh
     * Génère un nouvel access token à partir du refresh token.
     */
    @PostMapping("/refresh")
    @Operation(summary = "Rafraîchir le token")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
=======
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        Map<String, String> tokens = authService.register(request.getEmail(), request.getPassword(), request.getDisplayName());
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        Map<String, String> tokens = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody RefreshTokenRequest request) {
        Map<String, String> tokens = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(tokens);
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    }
}
