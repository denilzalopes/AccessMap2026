package com.accessmap.authservice.dto;
<<<<<<< HEAD
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class RefreshTokenRequest {
    @NotBlank private String refreshToken;
=======

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
}
