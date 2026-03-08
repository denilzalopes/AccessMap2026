package com.accessmap.authservice.repositories;

import com.accessmap.authservice.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/** Repository JPA pour l'entité User */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
=======
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
}
