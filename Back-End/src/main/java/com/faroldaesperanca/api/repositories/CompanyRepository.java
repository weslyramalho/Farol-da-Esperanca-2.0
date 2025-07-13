package com.faroldaesperanca.api.repositories;

import com.faroldaesperanca.api.entities.Company;
import com.faroldaesperanca.api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUser(User user);
}