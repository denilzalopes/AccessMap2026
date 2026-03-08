package com.accessmap.authservice.dto;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String userId;
    private String email;
    private String displayName;
    private String role;
    @Builder.Default private String tokenType = "Bearer";
}
