package com.faroldaesperanca.api.services;

import com.faroldaesperanca.api.dtos.CandidateProfileDTO;
import com.faroldaesperanca.api.entities.Candidate;
import com.faroldaesperanca.api.entities.User;
import com.faroldaesperanca.api.repositories.CandidateRepository;
import com.faroldaesperanca.api.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public CandidateService(CandidateRepository candidateRepository, UserRepository userRepository) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CandidateProfileDTO createOrUpdateCandidateProfile(Long userId, CandidateProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Candidate candidate = candidateRepository.findByUser(user)
                .orElseGet(() -> {
                    Candidate newCandidate = new Candidate();
                    newCandidate.setUser(user);
                    return newCandidate;
                });

        candidate.setFirstName(dto.getFirstName());
        candidate.setLastName(dto.getLastName());
        candidate.setPhone(dto.getPhone());
        candidate.setAddress(dto.getAddress());
        candidate.setResumeSummary(dto.getResumeSummary());
        candidate.setExperience(dto.getExperience());
        candidate.setEducation(dto.getEducation());
        candidate.setSkills(dto.getSkills());

        Candidate savedCandidate = candidateRepository.save(candidate);
        return convertToDTO(savedCandidate);
    }

    public Optional<CandidateProfileDTO> getCandidateProfile(Long userId) {
        return userRepository.findById(userId)
                .flatMap(candidateRepository::findByUser)
                .map(this::convertToDTO);
    }

    private CandidateProfileDTO convertToDTO(Candidate candidate) {
        return new CandidateProfileDTO(
                candidate.getId(),
                candidate.getUser().getId(),
                candidate.getFirstName(),
                candidate.getLastName(),
                candidate.getPhone(),
                candidate.getAddress(),
                candidate.getResumeSummary(),
                candidate.getExperience(),
                candidate.getEducation(),
                candidate.getSkills()
        );
    }
}