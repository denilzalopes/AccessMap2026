package com.accessmap.authservice.dto;
<<<<<<< HEAD
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class LoginRequest {
    @Email @NotBlank private String email;
    @NotBlank private String password;
=======

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
}
