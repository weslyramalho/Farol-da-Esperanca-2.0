package com.faroldaesperanca.api.dtos;

public class CandidateProfileDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String resumeSummary;
    private String experience;
    private String education;
    private String skills;

    // Construtor vazio
    public CandidateProfileDTO() {}

    // Construtor completo
    public CandidateProfileDTO(Long id, Long userId, String firstName, String lastName, String phone, String address, String resumeSummary, String experience, String education, String skills) {
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.resumeSummary = resumeSummary;
        this.experience = experience;
        this.education = education;
        this.skills = skills;
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getResumeSummary() {
        return resumeSummary;
    }

    public void setResumeSummary(String resumeSummary) {
        this.resumeSummary = resumeSummary;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
}