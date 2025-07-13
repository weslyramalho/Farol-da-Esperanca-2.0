package com.faroldaesperanca.api.controllers;

import com.faroldaesperanca.api.dtos.CandidateProfileDTO;
import com.faroldaesperanca.api.services.CandidateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*") // Permitir requisições de qualquer origem (ajustar para produção)
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    // Método auxiliar para obter o ID do usuário autenticado
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
            // Você precisará de um serviço de usuário para obter o ID do usuário a partir do email
            // Por simplicidade, assumimos que o email é o identificador e podemos obter o ID do usuário
            // Isso geralmente seria feito por um serviço de usuário que mapeia email para ID
            // Para este exemplo, vamos simular:
            // return userService.findByEmail(email).map(User::getId).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
            // Por enquanto, vamos usar um placeholder ou modificar o JWT para incluir o userId.
            // Para fins de demonstração, o userId será passado na URL e validado com o token.
            throw new IllegalStateException("ID do usuário autenticado não disponível diretamente. A lógica precisa ser refinada para obter o ID do usuário a partir do token/principal.");
        }
        throw new IllegalStateException("Usuário não autenticado.");
    }

    @PreAuthorize("hasRole('CANDIDATE') and #userId == authentication.principal.id") // Acessa apenas o próprio perfil
    @PutMapping("/{userId}/profile")
    public ResponseEntity<CandidateProfileDTO> updateCandidateProfile(@PathVariable Long userId, @RequestBody CandidateProfileDTO dto) {
        try {
            // No ambiente real, você obteria o userId do token JWT para garantir segurança
            // Aqui, estamos assumindo que o userId do path corresponde ao usuário autenticado (a validação @PreAuthorize ajuda)
            CandidateProfileDTO updatedProfile = candidateService.createOrUpdateCandidateProfile(userId, dto);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Trate o erro de forma mais granular
        }
    }

    @PreAuthorize("hasRole('CANDIDATE') and #userId == authentication.principal.id or hasRole('COMPANY')") // Candidato acessa o próprio, Empresa acessa qualquer
    @GetMapping("/{userId}/profile")
    public ResponseEntity<CandidateProfileDTO> getCandidateProfile(@PathVariable Long userId) {
        // No ambiente real, se for uma empresa acessando, não haveria um userId de path para ela
        // A lógica de segurança precisaria ser ajustada para permitir que empresas busquem perfis de candidatos
        return candidateService.getCandidateProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
