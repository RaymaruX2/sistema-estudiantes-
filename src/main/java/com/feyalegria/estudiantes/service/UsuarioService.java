package com.feyalegria.estudiantes.service;

import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario obtener(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + id));
    }

    public Usuario crear(Usuario u, String passwordPlano) {
        if (repo.existsByUsername(u.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }
        if (u.getEmail() != null && !u.getEmail().isBlank() && repo.existsByEmail(u.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        u.setPasswordHash(encoder.encode(passwordPlano));
        if (u.getActivo() == null) u.setActivo(true);
        return repo.save(u);
    }

    public Usuario actualizar(Long id, Usuario datos, String passwordPlano) {
        Usuario u = obtener(id);
        u.setNombreCompleto(datos.getNombreCompleto());
        u.setEmail(datos.getEmail());
        u.setRol(datos.getRol());
        u.setActivo(datos.getActivo());
        if (passwordPlano != null && !passwordPlano.isBlank()) {
            u.setPasswordHash(encoder.encode(passwordPlano));
        }
        return repo.save(u);
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}
