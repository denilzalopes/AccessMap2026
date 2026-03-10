package com.accessmap.userservice.services;
import com.accessmap.userservice.dto.UpdateProfileRequest;
import com.accessmap.userservice.models.User;
import com.accessmap.userservice.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
/** Service utilisateurs — gestion des profils et préférences d'accessibilité */
@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    public List<User> getAllUsers() { return userRepository.findAll(); }
    public Optional<User> getUserById(UUID id) { return userRepository.findById(id); }
    public Optional<User> getUserByEmail(String email) { return userRepository.findByEmail(email); }
    @Transactional
    public User updateProfile(UUID id, UpdateProfileRequest req) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (req.getDisplayName() != null) user.setDisplayName(req.getDisplayName());
        if (req.getAccessibilityPrefs() != null) user.setAccessibilityPrefs(req.getAccessibilityPrefs());
        return userRepository.save(user);
    }
    @Transactional public void deleteUser(UUID id) { userRepository.deleteById(id); }
}
