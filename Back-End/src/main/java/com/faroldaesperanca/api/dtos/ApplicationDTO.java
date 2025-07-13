package com.faroldaesperanca.api.dtos;

import java.time.LocalDateTime;

public class ApplicationDTO {
    private Long id;
    private Long candidateId;
    private Long jobId;
    private LocalDateTime applicationDate;
    private String status;
    private String jobTitle; // Para exibir o título da vaga na aplicação
    private String candidateName; // Para exibir o nome do candidato na aplicação

    public ApplicationDTO() {}

    public ApplicationDTO(Long id, Long candidateId, Long jobId, LocalDateTime applicationDate, String status, String jobTitle, String candidateName) {
        this.id = id;
        this.candidateId = candidateId;
        this.jobId = jobId;
        this.applicationDate = applicationDate;
        this.status = status;
        this.jobTitle = jobTitle;
        this.candidateName = candidateName;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }
}