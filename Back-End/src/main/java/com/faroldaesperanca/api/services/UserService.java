package com.faroldaesperanca.api.services;

import com.faroldaesperanca.api.entities.Candidate;
import com.faroldaesperanca.api.entities.Company;
import com.faroldaesperanca.api.entities.User;
import com.faroldaesperanca.api.repositories.CandidateRepository;
import com.faroldaesperanca.api.repositories.CompanyRepository;
import com.faroldaesperanca.api.repositories.UserRepository;
import com.faroldaesperanca.api.security.JwtService;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;


@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, CandidateRepository candidateRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public User registerUser(String email, String password, String role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email já registrado.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Collections.singleton(role.toUpperCase()));

        User savedUser = userRepository.save(user);

        if ("CANDIDATE".equals(role.toUpperCase())) {
            Candidate candidate = new Candidate();
            candidate.setUser(savedUser);
            candidateRepository.save(candidate);
        } else if ("COMPANY".equals(role.toUpperCase())) {
            Company company = new Company();
            company.setUser(savedUser);
            company.setName("Nova Empresa");
            companyRepository.save(company);
        } else {
            throw new IllegalArgumentException("Role inválida: " + role);
        }

        return savedUser;
    }

    public String generateAuthenticationToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + email));
        return jwtService.generateToken(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + email));

        Set<org.springframework.security.core.GrantedAuthority> authorities = new HashSet<>();
        for (String role : user.getRoles()) {
            authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role));
        }

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}