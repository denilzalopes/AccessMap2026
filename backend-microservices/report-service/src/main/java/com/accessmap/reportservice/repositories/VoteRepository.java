package com.accessmap.reportservice.repositories;

import com.accessmap.reportservice.models.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoteRepository extends JpaRepository<Vote, UUID> {
    Optional<Vote> findByReportIdAndUserId(UUID reportId, UUID userId);
    List<Vote> findByReportId(UUID reportId);

    @Modifying
    @Query("DELETE FROM Vote v WHERE v.reportId = :reportId")
    void deleteByReportId(@Param("reportId") UUID reportId);
}
