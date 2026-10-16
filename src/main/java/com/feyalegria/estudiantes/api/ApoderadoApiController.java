package com.feyalegria.estudiantes.api;

import com.feyalegria.estudiantes.api.Dtos.*;
import com.feyalegria.estudiantes.domain.*;
import com.feyalegria.estudiantes.service.ApoderadoService;
import com.feyalegria.estudiantes.service.AsistenciaReunionService;
import com.feyalegria.estudiantes.service.PagoService;
import com.feyalegria.estudiantes.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

/** Apoderados (padres), pagos, asistencias a reuniones y el portal del padre. */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Transactional
public class ApoderadoApiController {

    private final ApoderadoService apoderadoService;
    private final PagoService pagoService;
    private final AsistenciaReunionService asistenciaService;
    private final UsuarioService usuarioService;
    private final ValidadorApi validador;

    // ------------------------------------------------------------ apoderados

    @GetMapping("/apoderados")
    @Transactional(readOnly = true)
    public Pagina<ApoderadoDto> listar(@RequestParam(required = false) String q,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "50") int size) {
        return Pagina.de(apoderadoService.buscar(q, PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 500),
                Sort.by("apellidos", "nombres"))), ApoderadoDto::de);
    }

    /** Lista corta para los selectores de los formularios. */
    @GetMapping("/apoderados/todos")
    @Transactional(readOnly = true)
    public List<ApoderadoDto> todos() {
        return apoderadoService.listarTodos().stream()
                .sorted(Comparator.comparing(Apoderado::getApellidos).thenComparing(Apoderado::getNombres))
                .map(ApoderadoDto::de).toList();
    }

    @GetMapping("/apoderados/{id}")
    @Transactional(readOnly = true)
    public ApoderadoDto obtener(@PathVariable Long id) {
        return ApoderadoDto.de(apoderadoService.obtener(id));
    }

    @GetMapping("/apoderados/{id}/detalle")
    @Transactional(readOnly = true)
    public DetalleApoderadoDto detalle(@PathVariable Long id) {
        return DetalleApoderadoDto.de(apoderadoService.detalle(id));
    }

    @PostMapping("/apoderados")
    @ResponseStatus(HttpStatus.CREATED)
    public ApoderadoDto crear(@RequestBody ApoderadoRequest req) {
        return ApoderadoDto.de(apoderadoService.guardar(validador.validar(req.aEntidad())));
    }

    @PutMapping("/apoderados/{id}")
    public ApoderadoDto actualizar(@PathVariable Long id, @RequestBody ApoderadoRequest req) {
        return ApoderadoDto.de(apoderadoService.actualizar(id, validador.validar(req.aEntidad())));
    }

    @DeleteMapping("/apoderados/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        apoderadoService.eliminar(id);
    }

    // ----------------------------------------------------------------- pagos

    @GetMapping("/pagos")
    @Transactional(readOnly = true)
    public Pagina<PagoDto> pagos(@RequestParam(required = false) String q,
                                 @RequestParam(required = false) EstadoPago estado,
                                 @RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "50") int size) {
        return Pagina.de(pagoService.buscar(q, estado, PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 500),
                Sort.by(Sort.Direction.DESC, "fechaPago").and(Sort.by(Sort.Direction.DESC, "id")))), PagoDto::de);
    }

    @GetMapping("/pagos/{id}")
    @Transactional(readOnly = true)
    public PagoDto pago(@PathVariable Long id) {
        return PagoDto.de(pagoService.obtener(id));
    }

    @PostMapping("/pagos")
    @ResponseStatus(HttpStatus.CREATED)
    public PagoDto crearPago(@RequestBody PagoRequest req) {
        return PagoDto.de(pagoService.guardar(validador.validar(req.aEntidad())));
    }

    @PutMapping("/pagos/{id}")
    public PagoDto actualizarPago(@PathVariable Long id, @RequestBody PagoRequest req) {
        return PagoDto.de(pagoService.actualizar(id, validador.validar(req.aEntidad())));
    }

    @DeleteMapping("/pagos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPago(@PathVariable Long id) {
        pagoService.eliminar(id);
    }

    // ----------------------------------------------------------- asistencias

    @GetMapping("/asistencias")
    @Transactional(readOnly = true)
    public Pagina<AsistenciaDto> asistencias(@RequestParam(required = false) String q,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "50") int size) {
        return Pagina.de(asistenciaService.buscar(q, PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 500),
                Sort.by(Sort.Direction.DESC, "fechaReunion").and(Sort.by(Sort.Direction.DESC, "id")))), AsistenciaDto::de);
    }

    @GetMapping("/asistencias/{id}")
    @Transactional(readOnly = true)
    public AsistenciaDto asistencia(@PathVariable Long id) {
        return AsistenciaDto.de(asistenciaService.obtener(id));
    }

    @PostMapping("/asistencias")
    @ResponseStatus(HttpStatus.CREATED)
    public AsistenciaDto crearAsistencia(@RequestBody AsistenciaRequest req) {
        return AsistenciaDto.de(asistenciaService.guardar(validador.validar(req.aEntidad())));
    }

    @PutMapping("/asistencias/{id}")
    public AsistenciaDto actualizarAsistencia(@PathVariable Long id, @RequestBody AsistenciaRequest req) {
        return AsistenciaDto.de(asistenciaService.actualizar(id, validador.validar(req.aEntidad())));
    }

    @DeleteMapping("/asistencias/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarAsistencia(@PathVariable Long id) {
        asistenciaService.eliminar(id);
    }

    // ------------------------------------------------------- portal del padre

    @GetMapping("/padre/mi-familia")
    @Transactional(readOnly = true)
    public DetalleApoderadoDto miFamilia(@AuthenticationPrincipal UserDetails user) {
        Usuario u = usuarioService.buscarConApoderado(user.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (u.getApoderado() == null) {
            throw new IllegalArgumentException("Tu cuenta no está vinculada a ningún apoderado. Comunícate con secretaría.");
        }
        return DetalleApoderadoDto.de(apoderadoService.detalle(u.getApoderado().getId()));
    }
}
