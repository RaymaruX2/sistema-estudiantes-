package com.feyalegria.estudiantes.api;

import com.feyalegria.estudiantes.api.Dtos.UsuarioDto;
import com.feyalegria.estudiantes.api.Dtos.UsuarioRequest;
import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Gestión de cuentas (solo ADMIN). */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Transactional
public class UsuarioApiController {

    private final UsuarioService service;
    private final ValidadorApi validador;

    @GetMapping
    @Transactional(readOnly = true)
    public List<UsuarioDto> listar() {
        return service.listar().stream().map(UsuarioDto::de).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioDto crear(@RequestBody UsuarioRequest req) {
        Usuario u = validador.validar(req.aEntidad());
        return UsuarioDto.de(service.crear(u, req.password()));
    }

    @PutMapping("/{id}")
    public UsuarioDto actualizar(@PathVariable Long id, @RequestBody UsuarioRequest req) {
        Usuario datos = req.aEntidad();
        datos.setUsername(service.obtener(id).getUsername());
        validador.validar(datos);
        return UsuarioDto.de(service.actualizar(id, datos, req.password()));
    }

    @PostMapping("/{id}/aprobar")
    public UsuarioDto aprobar(@PathVariable Long id) {
        return UsuarioDto.de(service.aprobar(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        service.eliminar(id, user.getUsername());
    }
}
