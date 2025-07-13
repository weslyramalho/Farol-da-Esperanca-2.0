package com.faroldaesperanca.api.repositories;

import com.faroldaesperanca.api.entities.Application;
import com.faroldaesperanca.api.entities.Candidate;
import com.faroldaesperanca.api.entities.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidate(Candidate candidate);
    List<Application> findByJob(Job job);
    Optional<Application> findByCandidateAndJob(Candidate candidate, Job job);
}