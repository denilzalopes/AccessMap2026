package com.accessmap.reportservice.repositories;

import com.accessmap.reportservice.models.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
}
