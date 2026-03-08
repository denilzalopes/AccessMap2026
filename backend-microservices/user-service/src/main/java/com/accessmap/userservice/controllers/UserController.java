package com.accessmap.userservice.controllers;
<<<<<<< HEAD
import com.accessmap.userservice.dto.UpdateProfileRequest;
import com.accessmap.userservice.models.User;
import com.accessmap.userservice.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController @RequestMapping("/api/users") @RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "Gestion des profils AccessMap")
public class UserController {
    private final UserService userService;
    @GetMapping public ResponseEntity<List<User>> getAll() { return ResponseEntity.ok(userService.getAllUsers()); }
    @GetMapping("/{id}") @Operation(summary = "Profil utilisateur")
    public ResponseEntity<User> getById(@PathVariable UUID id) {
        return userService.getUserById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}") @Operation(summary = "Mettre à jour le profil")
    public ResponseEntity<User> update(@PathVariable UUID id, @Valid @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(userService.updateProfile(id, req));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.deleteUser(id); return ResponseEntity.noContent().build();
=======

import com.accessmap.userservice.models.User;
import com.accessmap.userservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
    }
}
