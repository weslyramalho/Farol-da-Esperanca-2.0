package com.faroldaesperanca.api.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    @Lob
    private String requirements;

    private String location;
    private String salaryRange;

    @Column(name = "posted_date")
    private LocalDateTime postedDate;

    @Column(name = "expires_date")
    private LocalDateTime expiresDate;

    // Construtores
    public Job() {
        this.postedDate = LocalDateTime.now();
    }

    public Job(Company company, String title, String description, String requirements, String location, String salaryRange, LocalDateTime expiresDate) {
        this.company = company;
        this.title = title;
        this.description = description;
        this.requirements = requirements;
        this.location = location;
        this.salaryRange = salaryRange;
        this.postedDate = LocalDateTime.now();
        this.expiresDate = expiresDate;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
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
}
