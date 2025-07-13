package com.faroldaesperanca.api.controllers;

import com.faroldaesperanca.api.dtos.ApplicationDTO;
import com.faroldaesperanca.api.dtos.CandidateProfileDTO;
import com.faroldaesperanca.api.services.ApplicationService;
import com.faroldaesperanca.api.services.CandidateService;
import com.faroldaesperanca.api.services.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*") // Permitir requisições de qualquer origem (ajustar para produção)
public class ApplicationController {

    private final ApplicationService applicationService;
    private final CandidateService candidateService; // Para obter o ID do candidato do usuário logado
    private final JobService jobService; // Para validar se a vaga existe

    public ApplicationController(ApplicationService applicationService, CandidateService candidateService, JobService jobService) {
        this.applicationService = applicationService;
        this.candidateService = candidateService;
        this.jobService = jobService;
    }

    @PreAuthorize("hasRole('CANDIDATE') and @candidateService.getCandidateProfile(authentication.principal.id).orElse(null)?.id == #candidateId") // Garante que o candidato só aplique para si
    @PostMapping("/apply/{candidateId}/{jobId}")
    public ResponseEntity<?> applyForJob(@PathVariable Long candidateId, @PathVariable Long jobId) {
        try {
            // Verificar se a vaga existe
            jobService.getJobById(jobId)
                    .orElseThrow(() -> new RuntimeException("Vaga não encontrada."));

            ApplicationDTO newApplication = applicationService.applyForJob(candidateId, jobId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newApplication);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('COMPANY')") // A empresa pode atualizar o status de qualquer aplicação
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(@PathVariable Long applicationId, @RequestParam String status) {
        try {
            ApplicationDTO updatedApplication = applicationService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(updatedApplication);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('CANDIDATE') and @candidateService.getCandidateProfile(authentication.principal.id).orElse(null)?.id == #candidateId") // Candidato visualiza suas próprias aplicações
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByCandidate(@PathVariable Long candidateId) {
        List<ApplicationDTO> applications = applicationService.getApplicationsByCandidate(candidateId);
        return ResponseEntity.ok(applications);
    }

    @PreAuthorize("hasRole('COMPANY')") // Empresa visualiza aplicações para suas vagas
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJob(@PathVariable Long jobId) {
        List<ApplicationDTO> applications = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(applications);
    }

    @PreAuthorize("hasRole('COMPANY')") // Empresa visualiza o perfil do candidato através da aplicação
    @GetMapping("/{applicationId}/candidate-profile")
    public ResponseEntity<CandidateProfileDTO> getCandidateProfileByApplication(@PathVariable Long applicationId) {
        return applicationService.getCandidateProfileByApplicationId(applicationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}