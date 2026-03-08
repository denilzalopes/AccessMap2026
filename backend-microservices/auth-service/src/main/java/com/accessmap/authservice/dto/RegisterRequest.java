package com.accessmap.authservice.dto;
<<<<<<< HEAD
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class RegisterRequest {
    @Email(message = "Email invalide") @NotBlank private String email;
    @NotBlank @Size(min = 8, message = "Minimum 8 caractères") private String password;
    @NotBlank @Size(max = 100) private String displayName;
=======

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String displayName;
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
}
