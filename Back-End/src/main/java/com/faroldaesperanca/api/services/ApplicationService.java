package com.faroldaesperanca.api.services;

import com.faroldaesperanca.api.dtos.ApplicationDTO;
import com.faroldaesperanca.api.dtos.CandidateProfileDTO;
import com.faroldaesperanca.api.entities.Application;
import com.faroldaesperanca.api.entities.Candidate;
import com.faroldaesperanca.api.entities.Job;
import com.faroldaesperanca.api.repositories.ApplicationRepository;
import com.faroldaesperanca.api.repositories.CandidateRepository;
import com.faroldaesperanca.api.repositories.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final UserService userService; // Para obter o usuário autenticado

    public ApplicationService(ApplicationRepository applicationRepository, CandidateRepository candidateRepository, JobRepository jobRepository, UserService userService) {
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.userService = userService;
    }

    @Transactional
    public ApplicationDTO applyForJob(Long candidateId, Long jobId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado com ID: " + candidateId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada com ID: " + jobId));

        // Verificar se o candidato já se aplicou para esta vaga
        if (applicationRepository.findByCandidateAndJob(candidate, job).isPresent()) {
            throw new IllegalStateException("Candidato já se aplicou para esta vaga.");
        }

        Application application = new Application();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus("PENDING"); // Status inicial

        Application savedApplication = applicationRepository.save(application);
        return convertToDTO(savedApplication);
    }

    @Transactional
    public ApplicationDTO updateApplicationStatus(Long applicationId, String newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Aplicação não encontrada com ID: " + applicationId));
        application.setStatus(newStatus);
        Application updatedApplication = applicationRepository.save(application);
        return convertToDTO(updatedApplication);
    }

    public List<ApplicationDTO> getApplicationsByCandidate(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado com ID: " + candidateId));
        return applicationRepository.findByCandidate(candidate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada com ID: " + jobId));
        return applicationRepository.findByJob(job).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ApplicationDTO> getApplicationById(Long id) {
        return applicationRepository.findById(id).map(this::convertToDTO);
    }

    // Método para a empresa visualizar o perfil do candidato que se candidatou
    public Optional<CandidateProfileDTO> getCandidateProfileByApplicationId(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .map(Application::getCandidate)
                .map(candidate -> new CandidateProfileDTO(
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
                ));
    }


    private ApplicationDTO convertToDTO(Application application) {
        String candidateName = Optional.ofNullable(application.getCandidate())
                .map(c -> c.getFirstName() + " " + c.getLastName())
                .orElse("Nome do Candidato Indisponível");
        String jobTitle = Optional.ofNullable(application.getJob())
                .map(Job::getTitle)
                .orElse("Título da Vaga Indisponível");

        return new ApplicationDTO(
                application.getId(),
                application.getCandidate().getId(),
                application.getJob().getId(),
                application.getApplicationDate(),
                application.getStatus(),
                jobTitle,
                candidateName
        );
    }
}