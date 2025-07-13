package com.faroldaesperanca.api.security;



import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // Mudar de UserService para UserDetailsService

    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) { // Alterar construtor
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        Long userId = null; // Para armazenar o ID do usuário

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
            // Extrair o userId do token
            try {
                userId = ((Integer) jwtService.extractClaim(token, claims -> claims.get("userId"))).longValue();
            } catch (Exception e) {
                // Lidar com o caso em que userId não está presente ou não é um Integer
                System.err.println("Erro ao extrair userId do token: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username); // Usar userDetailsService

            if (jwtService.isTokenValid(token, userDetails)) {
                // Cria um UsernamePasswordAuthenticationToken e injeta o userId no principal
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        new CustomUserDetails(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities(), userId), // Usando CustomUserDetails
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}