package com.faroldaesperanca.api.controllers;

import com.faroldaesperanca.api.dtos.CompanyProfileDTO;
import com.faroldaesperanca.api.dtos.JobDTO;
import com.faroldaesperanca.api.services.CompanyService;
import com.faroldaesperanca.api.services.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*") // Permitir requisições de qualquer origem (ajustar para produção)
public class CompanyController {

    private final CompanyService companyService;
    private final JobService jobService;

    public CompanyController(CompanyService companyService, JobService jobService) {
        this.companyService = companyService;
        this.jobService = jobService;
    }

    @PreAuthorize("hasRole('COMPANY') and #userId == authentication.principal.id") // Acessa apenas o próprio perfil
    @PutMapping("/{userId}/profile")
    public ResponseEntity<CompanyProfileDTO> updateCompanyProfile(@PathVariable Long userId, @RequestBody CompanyProfileDTO dto) {
        try {
            CompanyProfileDTO updatedProfile = companyService.createOrUpdateCompanyProfile(userId, dto);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Trate o erro de forma mais granular
        }
    }

    @PreAuthorize("hasRole('COMPANY') and #userId == authentication.principal.id")
    @GetMapping("/{userId}/profile")
    public ResponseEntity<CompanyProfileDTO> getCompanyProfile(@PathVariable Long userId) {
        return companyService.getCompanyProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('COMPANY') and @companyService.getCompanyByUserId(authentication.principal.id).orElse(null)?.id == #companyId") // Garante que a empresa só crie vaga para si
    @PostMapping("/{companyId}/jobs")
    public ResponseEntity<JobDTO> createJob(@PathVariable Long companyId, @RequestBody JobDTO jobDTO) {
        try {
            JobDTO createdJob = jobService.createJob(companyId, jobDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PreAuthorize("hasRole('COMPANY') and @jobService.getJobById(#jobId).orElse(null)?.companyId == @companyService.getCompanyByUserId(authentication.principal.id).orElse(null)?.id") // Garante que a empresa só edite suas próprias vagas
    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long jobId, @RequestBody JobDTO jobDTO) {
        try {
            JobDTO updatedJob = jobService.updateJob(jobId, jobDTO);
            return ResponseEntity.ok(updatedJob);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PreAuthorize("hasRole('COMPANY') and @jobService.getJobById(#jobId).orElse(null)?.companyId == @companyService.getCompanyByUserId(authentication.principal.id).orElse(null)?.id") // Garante que a empresa só delete suas próprias vagas
    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId) {
        try {
            jobService.deleteJob(jobId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('COMPANY') and @companyService.getCompanyByUserId(authentication.principal.id).orElse(null)?.id == #companyId") // Garante que a empresa só visualize suas próprias vagas
    @GetMapping("/{companyId}/jobs")
    public ResponseEntity<List<JobDTO>> getJobsByCompany(@PathVariable Long companyId) {
        List<JobDTO> jobs = jobService.getJobsByCompanyId(companyId);
        return ResponseEntity.ok(jobs);
    }
}