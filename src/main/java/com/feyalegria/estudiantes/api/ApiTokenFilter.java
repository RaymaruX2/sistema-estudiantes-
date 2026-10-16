package com.feyalegria.estudiantes.api;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/** Lee el encabezado "Authorization: Bearer ..." y autentica al usuario de la API. */
@Component
@RequiredArgsConstructor
public class ApiTokenFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            tokenService.validar(header.substring(7).trim()).ifPresent(username -> {
                try {
                    UserDetails user = userDetailsService.loadUserByUsername(username);
                    if (user.isEnabled()) {
                        var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                } catch (UsernameNotFoundException ignored) {
                    // usuario eliminado: el token deja de servir
                }
            });
        }
        chain.doFilter(req, res);
    }

    /** Evita que Spring Boot registre este filtro también para las páginas web. */
    @Configuration
    static class Registro {
        @Bean
        FilterRegistrationBean<ApiTokenFilter> noRegistrarGlobal(ApiTokenFilter filtro) {
            FilterRegistrationBean<ApiTokenFilter> r = new FilterRegistrationBean<>(filtro);
            r.setEnabled(false);
            return r;
        }
    }
}
