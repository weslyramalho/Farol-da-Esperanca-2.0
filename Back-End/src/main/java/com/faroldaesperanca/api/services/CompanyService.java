package com.faroldaesperanca.api.services;

import com.faroldaesperanca.api.dtos.CompanyProfileDTO;
import com.faroldaesperanca.api.entities.Company;
import com.faroldaesperanca.api.entities.User;
import com.faroldaesperanca.api.repositories.CompanyRepository;
import com.faroldaesperanca.api.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CompanyProfileDTO createOrUpdateCompanyProfile(Long userId, CompanyProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Company company = companyRepository.findByUser(user)
                .orElseGet(() -> {
                    Company newCompany = new Company();
                    newCompany.setUser(user);
                    return newCompany;
                });

        company.setName(dto.getName());
        company.setDescription(dto.getDescription());
        company.setWebsite(dto.getWebsite());
        company.setIndustry(dto.getIndustry());

        Company savedCompany = companyRepository.save(company);
        return convertToDTO(savedCompany);
    }

    public Optional<CompanyProfileDTO> getCompanyProfile(Long userId) {
        return userRepository.findById(userId)
                .flatMap(companyRepository::findByUser)
                .map(this::convertToDTO);
    }

    public Optional<Company> getCompanyByUserId(Long userId) {
        return userRepository.findById(userId)
                .flatMap(companyRepository::findByUser);
    }

    private CompanyProfileDTO convertToDTO(Company company) {
        return new CompanyProfileDTO(
                company.getId(),
                company.getUser().getId(),
                company.getName(),
                company.getDescription(),
                company.getWebsite(),
                company.getIndustry()
        );
    }
}