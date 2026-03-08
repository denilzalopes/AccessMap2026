package com.accessmap.authservice.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class RegisterRequest {
    @Email(message = "Email invalide") @NotBlank private String email;
    @NotBlank @Size(min = 8, message = "Minimum 8 caractères") private String password;
    @NotBlank @Size(max = 100) private String displayName;
}
