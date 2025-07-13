package com.faroldaesperanca.api.repositories;

import com.faroldaesperanca.api.entities.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByTitleContainingIgnoreCase(String title);
    List<Job> findByLocationContainingIgnoreCase(String location);
    List<Job> findByCompanyId(Long companyId);
}