package com.faroldaesperanca.api.repositories;

import com.faroldaesperanca.api.entities.Candidate;
import com.faroldaesperanca.api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByUser(User user);
}
