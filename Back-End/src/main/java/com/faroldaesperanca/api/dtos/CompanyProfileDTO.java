package com.faroldaesperanca.api.dtos;

public class CompanyProfileDTO {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private String website;
    private String industry;

    // Construtor vazio
    public CompanyProfileDTO() {}

    // Construtor completo
    public CompanyProfileDTO(Long id, Long userId, String name, String description, String website, String industry) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.website = website;
        this.industry = industry;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }
}