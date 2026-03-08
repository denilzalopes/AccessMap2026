package com.accessmap.reportservice.repositories;
<<<<<<< HEAD
=======

>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
import com.accessmap.reportservice.models.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
<<<<<<< HEAD
=======

>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
public interface VoteRepository extends JpaRepository<Vote, UUID> {
    Optional<Vote> findByReportIdAndUserId(UUID reportId, UUID userId);
}
