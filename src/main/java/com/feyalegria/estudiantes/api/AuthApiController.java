package com.feyalegria.estudiantes.api;

import com.feyalegria.estudiantes.api.Dtos.*;
import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Transactional
public class AuthApiController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @GetMapping("/salud")
    public Map<String, String> salud() {
        return Map.of("estado", "ok");
    }

    /** Inicia sesión con usuario o email. */
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Usuario u = usuarioService.buscarPorUsuarioOEmail(req.usuario()).orElse(null);
        if (u == null || req.password() == null || !passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario o contraseña incorrectos"));
        }
        if (!Boolean.TRUE.equals(u.getActivo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Tu cuenta está pendiente de aprobación por un administrador"));
        }
        Usuario conApoderado = usuarioService.buscarConApoderado(u.getUsername()).orElse(u);
        return ResponseEntity.ok(new SesionDto(tokenService.generar(u.getUsername()),
                tokenService.segundosDeVida(), UsuarioDto.de(conApoderado)));
    }

    /** Registro público de padres (activos al instante) y personal (pendiente de aprobación). */
    @PostMapping("/auth/registro")
    public ResponseEntity<?> registro(@RequestBody UsuarioService.SolicitudRegistro solicitud) {
        Usuario u = usuarioService.registrar(solicitud);
        String mensaje = Boolean.TRUE.equals(u.getActivo())
                ? "Cuenta creada. Ya puedes iniciar sesión con tu DNI o tu email."
                : "Solicitud enviada. Un administrador debe aprobar tu cuenta antes de que puedas ingresar.";
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "mensaje", mensaje,
                "pendiente", !Boolean.TRUE.equals(u.getActivo()),
                "usuario", UsuarioDto.de(u)));
    }

    @GetMapping("/auth/yo")
    public UsuarioDto yo(@AuthenticationPrincipal UserDetails user) {
        return usuarioService.buscarConApoderado(user.getUsername()).map(UsuarioDto::de)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }
}
