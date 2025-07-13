package com.faroldaesperanca.api.dtos;

import java.time.LocalDateTime;

public class JobDTO {
    private Long id;
    private Long companyId;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private String salaryRange;
    private LocalDateTime postedDate;
    private LocalDateTime expiresDate;
    private String companyName; // Para exibir o nome da empresa na vaga

    public JobDTO() {}

    public JobDTO(Long id, Long companyId, String title, String description, String requirements, String location, String salaryRange, LocalDateTime postedDate, LocalDateTime expiresDate, String companyName) {
        this.id = id;
        this.companyId = companyId;
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.location = location;
        this.salaryRange = salaryRange;
        this.postedDate = postedDate;
        this.expiresDate = expiresDate;
        this.companyName = companyName;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDateTime postedDate) {
        this.postedDate = postedDate;
    }

    public LocalDateTime getExpiresDate() {
        return expiresDate;
    }

    public void setExpiresDate(LocalDateTime expiresDate) {
        this.expiresDate = expiresDate;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}