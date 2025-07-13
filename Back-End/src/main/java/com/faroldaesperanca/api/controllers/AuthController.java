package com.faroldaesperanca.api.controllers;

import com.faroldaesperanca.api.dtos.AuthRequest;
import com.faroldaesperanca.api.dtos.AuthResponse;
import com.faroldaesperanca.api.dtos.RegisterRequest;
import com.faroldaesperanca.api.entities.User;
import com.faroldaesperanca.api.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permitir requisições de qualquer origem (ajustar para produção)
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager; // Injetar AuthenticationManager aqui

    public AuthController(UserService userService, AuthenticationManager authenticationManager) { // Adicionar no construtor
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request.getEmail(), request.getPassword(), request.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            // Realiza a autenticação usando AuthenticationManager
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
            // Se a autenticação for bem-sucedida, gera o token
            String token = userService.generateAuthenticationToken(authRequest.getEmail()); // Chamar novo método
            User user = userService.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Erro ao buscar usuário após autenticação."));
            String role = user.getRoles().stream().findFirst().orElse("UNKNOWN");
            return ResponseEntity.ok(new AuthResponse(token, role, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas: " + e.getMessage());
        }
    }
}