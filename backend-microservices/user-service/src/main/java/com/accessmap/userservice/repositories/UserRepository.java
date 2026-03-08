package com.accessmap.userservice.repositories;
<<<<<<< HEAD
=======

>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
import com.accessmap.userservice.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
<<<<<<< HEAD
=======

>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}
