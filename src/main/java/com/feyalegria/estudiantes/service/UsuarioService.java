package com.feyalegria.estudiantes.service;

import com.feyalegria.estudiantes.domain.Apoderado;
import com.feyalegria.estudiantes.domain.Rol;
import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.repository.ApoderadoRepository;
import com.feyalegria.estudiantes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    public static final int LARGO_MINIMO_PASSWORD = 8;

    private final UsuarioRepository repo;
    private final ApoderadoRepository apoderadoRepo;
    private final PasswordEncoder encoder;

    /** Datos del formulario público de registro. */
    public record SolicitudRegistro(String tipo,           // "PADRE" o "PERSONAL"
                                    String nombreCompleto,
                                    String dni,            // obligatorio para PADRE
                                    String username,       // obligatorio para PERSONAL
                                    String email,
                                    String password,
                                    String confirmarPassword) {
    }

    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return repo.listarConApoderado();
    }

    @Transactional(readOnly = true)
    public Usuario obtener(Long id) {
        return repo.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarConApoderado(String username) {
        return repo.findConApoderado(username);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorUsuarioOEmail(String valor) {
        if (valor == null) return Optional.empty();
        String v = valor.trim();
        return repo.findByUsername(v).or(() -> repo.findByEmailIgnoreCase(v));
    }

    public Usuario crear(Usuario u, String passwordPlano) {
        normalizar(u);
        validarPassword(passwordPlano);
        if (repo.existsByUsername(u.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }
        if (u.getEmail() != null && repo.existsByEmail(u.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        validarVinculoPadre(u, null);
        u.setPasswordHash(encoder.encode(passwordPlano));
        if (u.getActivo() == null) u.setActivo(true);
        return repo.save(u);
    }

    public Usuario actualizar(Long id, Usuario datos, String passwordPlano) {
        normalizar(datos);
        Usuario u = obtener(id);
        if (datos.getEmail() != null && repo.existsByEmailAndIdNot(datos.getEmail(), id)) {
            throw new IllegalArgumentException("El email ya está registrado por otro usuario");
        }
        boolean dejaDeSerAdminActivo = u.getRol() == Rol.ADMIN && Boolean.TRUE.equals(u.getActivo())
                && (datos.getRol() != Rol.ADMIN || !Boolean.TRUE.equals(datos.getActivo()));
        if (dejaDeSerAdminActivo && repo.countByRolAndActivoTrue(Rol.ADMIN) <= 1) {
            throw new IllegalArgumentException("No puedes quitar el rol o desactivar al último administrador activo");
        }
        validarVinculoPadre(datos, id);
        u.setNombreCompleto(datos.getNombreCompleto());
        u.setEmail(datos.getEmail());
        u.setRol(datos.getRol());
        u.setActivo(datos.getActivo() != null ? datos.getActivo() : Boolean.FALSE);
        u.setApoderado(datos.getRol() == Rol.PADRE ? datos.getApoderado() : null);
        if (passwordPlano != null && !passwordPlano.isBlank()) {
            validarPassword(passwordPlano);
            u.setPasswordHash(encoder.encode(passwordPlano));
        }
        return repo.save(u);
    }

    /** Activa una cuenta que quedó pendiente después del registro público. */
    public Usuario aprobar(Long id) {
        Usuario u = obtener(id);
        u.setActivo(true);
        return repo.save(u);
    }

    public void eliminar(Long id, String usernameActual) {
        Usuario u = obtener(id);
        if (u.getUsername().equals(usernameActual)) {
            throw new IllegalArgumentException("No puedes eliminar tu propia cuenta");
        }
        if (u.getRol() == Rol.ADMIN && Boolean.TRUE.equals(u.getActivo())
                && repo.countByRolAndActivoTrue(Rol.ADMIN) <= 1) {
            throw new IllegalArgumentException("No puedes eliminar al último administrador activo");
        }
        repo.deleteById(id);
    }

    /**
     * Registro público.
     * - PADRE: su DNI debe estar registrado como apoderado. La cuenta queda activa y vinculada
     *   a ese apoderado; el usuario de acceso es su DNI (también puede entrar con su email).
     * - PERSONAL: se crea como SECRETARIA inactiva; un administrador debe aprobarla.
     */
    public Usuario registrar(SolicitudRegistro s) {
        if (s.nombreCompleto() == null || s.nombreCompleto().isBlank()) {
            throw new IllegalArgumentException("El nombre completo es obligatorio");
        }
        if (s.password() == null || !s.password().equals(s.confirmarPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }
        validarPassword(s.password());
        String email = (s.email() == null || s.email().isBlank()) ? null : s.email().trim().toLowerCase();
        if (email != null && repo.existsByEmail(email)) {
            throw new IllegalArgumentException("Ese email ya está registrado");
        }

        Usuario u = new Usuario();
        u.setNombreCompleto(s.nombreCompleto().trim());
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(s.password()));

        if ("PADRE".equalsIgnoreCase(s.tipo())) {
            String dni = s.dni() == null ? "" : s.dni().trim();
            if (dni.isEmpty()) throw new IllegalArgumentException("El DNI es obligatorio");
            Apoderado a = apoderadoRepo.findByDni(dni).orElseThrow(() -> new IllegalArgumentException(
                    "Tu DNI no figura como apoderado en el colegio. Acércate a secretaría para que te registren."));
            if (repo.existsByApoderadoId(a.getId())) {
                throw new IllegalArgumentException("Ya existe una cuenta para este apoderado. Inicia sesión o pide ayuda a secretaría.");
            }
            if (repo.existsByUsername(dni)) {
                throw new IllegalArgumentException("Ya existe una cuenta con ese DNI");
            }
            u.setUsername(dni);
            u.setRol(Rol.PADRE);
            u.setApoderado(a);
            u.setActivo(true);
        } else if ("PERSONAL".equalsIgnoreCase(s.tipo())) {
            String username = s.username() == null ? "" : s.username().trim();
            if (!username.matches("[A-Za-z0-9._-]{3,60}")) {
                throw new IllegalArgumentException("El usuario debe tener entre 3 y 60 caracteres (letras, números, punto, guion)");
            }
            if (repo.existsByUsername(username)) {
                throw new IllegalArgumentException("Ese nombre de usuario ya está en uso");
            }
            u.setUsername(username);
            u.setRol(Rol.SECRETARIA);
            u.setActivo(false);
        } else {
            throw new IllegalArgumentException("Elige el tipo de cuenta");
        }
        return repo.save(u);
    }

    private void validarVinculoPadre(Usuario u, Long idActual) {
        if (u.getRol() != Rol.PADRE) {
            u.setApoderado(null);
            return;
        }
        if (u.getApoderado() == null || u.getApoderado().getId() == null) {
            throw new IllegalArgumentException("Un usuario PADRE debe estar vinculado a un apoderado");
        }
        Long apoderadoId = u.getApoderado().getId();
        u.setApoderado(apoderadoRepo.findById(apoderadoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Apoderado no encontrado")));
        boolean ocupado = idActual == null
                ? repo.existsByApoderadoId(apoderadoId)
                : repo.existsByApoderadoIdAndIdNot(apoderadoId, idActual);
        if (ocupado) {
            throw new IllegalArgumentException("Ese apoderado ya tiene una cuenta de usuario");
        }
    }

    private void validarPassword(String p) {
        if (p == null || p.length() < LARGO_MINIMO_PASSWORD) {
            throw new IllegalArgumentException("La contraseña debe tener al menos " + LARGO_MINIMO_PASSWORD + " caracteres");
        }
    }

    private void normalizar(Usuario u) {
        if (u.getUsername() != null) u.setUsername(u.getUsername().trim());
        if (u.getEmail() != null) {
            String e = u.getEmail().trim().toLowerCase();
            u.setEmail(e.isEmpty() ? null : e);
        }
    }
}
