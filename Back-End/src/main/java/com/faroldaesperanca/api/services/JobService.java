package com.faroldaesperanca.api.services;
import com.faroldaesperanca.api.dtos.JobDTO;
import com.faroldaesperanca.api.entities.Company;
import com.faroldaesperanca.api.entities.Job;
import com.faroldaesperanca.api.repositories.CompanyRepository;
import com.faroldaesperanca.api.repositories.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public JobService(JobRepository jobRepository, CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public JobDTO createJob(Long companyId, JobDTO dto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada com ID: " + companyId));

        Job job = new Job();
        job.setCompany(company);
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements());
        job.setLocation(dto.getLocation());
        job.setSalaryRange(dto.getSalaryRange());
        job.setExpiresDate(dto.getExpiresDate());

        Job savedJob = jobRepository.save(job);
        return convertToDTO(savedJob);
    }

    @Transactional
    public JobDTO updateJob(Long jobId, JobDTO dto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada com ID: " + jobId));

        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements());
        job.setLocation(dto.getLocation());
        job.setSalaryRange(dto.getSalaryRange());
        job.setExpiresDate(dto.getExpiresDate());

        Job updatedJob = jobRepository.save(job);
        return convertToDTO(updatedJob);
    }

    @Transactional
    public void deleteJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new RuntimeException("Vaga não encontrada com ID: " + jobId);
        }
        jobRepository.deleteById(jobId);
    }

    public Optional<JobDTO> getJobById(Long id) {
        return jobRepository.findById(id).map(this::convertToDTO);
    }

    public List<JobDTO> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> searchJobs(String keyword, String location) {
        List<Job> jobs;
        if (keyword != null && !keyword.isEmpty() && location != null && !location.isEmpty()) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(keyword); // Ou combinar com location usando Specification
            jobs.retainAll(jobRepository.findByLocationContainingIgnoreCase(location));
        } else if (keyword != null && !keyword.isEmpty()) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(keyword);
        } else if (location != null && !location.isEmpty()) {
            jobs = jobRepository.findByLocationContainingIgnoreCase(location);
        } else {
            jobs = jobRepository.findAll();
        }
        return jobs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> getJobsByCompanyId(Long companyId) {
        return jobRepository.findByCompanyId(companyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private JobDTO convertToDTO(Job job) {
        return new JobDTO(
                job.getId(),
                job.getCompany().getId(),
                job.getTitle(),
                job.getDescription(),
                job.getRequirements(),
                job.getLocation(),
                job.getSalaryRange(),
                job.getPostedDate(),
                job.getExpiresDate(),
                job.getCompany().getName() // Adiciona o nome da empresa
        );
    }
}