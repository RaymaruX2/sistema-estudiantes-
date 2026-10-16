package com.feyalegria.estudiantes.config;

import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepo;

    /** Permite iniciar sesión con el nombre de usuario o con el email. */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String valor = username == null ? "" : username.trim();
        Usuario u = usuarioRepo.findByUsername(valor)
                .or(() -> usuarioRepo.findByEmailIgnoreCase(valor))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no existe: " + valor));
        return User.builder()
                .username(u.getUsername())
                .password(u.getPasswordHash())
                .disabled(!Boolean.TRUE.equals(u.getActivo()))
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol().name())))
                .build();
    }
}
