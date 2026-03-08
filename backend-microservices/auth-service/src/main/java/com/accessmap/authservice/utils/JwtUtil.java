package com.accessmap.authservice.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utilitaire JWT — génération et validation des tokens d'accès et de rafraîchissement.
 * Utilise l'API JJWT 0.12.x avec SecretKey (remplace SignatureAlgorithm déprécié).
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;

    @Value("${app.jwt.expiration}")
    private long EXPIRATION_TIME;

    @Value("${app.jwt.refresh-expiration}")
    private long REFRESH_EXPIRATION_TIME;

    // ── Extraction des claims ────────────────────────────────────────────────

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        // API 0.12.x : parser() + verifyWith() au lieu de parserBuilder() + setSigningKey()
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ── Validation ───────────────────────────────────────────────────────────

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // ── Génération ───────────────────────────────────────────────────────────

    /**
     * Génère un token JWT avec userId et role en claims supplémentaires.
     *
     * @param userName       email de l'utilisateur (subject)
     * @param userId         UUID de l'utilisateur
     * @param role           rôle (CONTRIBUTOR, MODERATOR, ADMIN)
     * @param expirationTime durée en millisecondes
     */
    public String generateToken(String userName, String userId, String role, long expirationTime) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        return createToken(claims, userName, expirationTime);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        // API 0.12.x : claims() au lieu de setClaims(), signWith(key) sans algorithme explicite
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey())   // HS256 inféré automatiquement
                .compact();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ── Getters ──────────────────────────────────────────────────────────────

    public long getExpiration() {
        return EXPIRATION_TIME;
    }

    public long getRefreshExpiration() {
        return REFRESH_EXPIRATION_TIME;
    }
}
