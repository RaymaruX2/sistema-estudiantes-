package com.feyalegria.estudiantes.api;

import com.feyalegria.estudiantes.api.Dtos.*;
import com.feyalegria.estudiantes.domain.*;
import com.feyalegria.estudiantes.repository.ApoderadoRepository;
import com.feyalegria.estudiantes.repository.UsuarioRepository;
import com.feyalegria.estudiantes.service.ApoderadoService;
import com.feyalegria.estudiantes.service.EstudianteService;
import com.feyalegria.estudiantes.web.EstudianteController;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Transactional
public class EstudianteApiController {

    private final EstudianteService service;
    private final ApoderadoService apoderadoService;
    private final ApoderadoRepository apoderadoRepo;
    private final UsuarioRepository usuarioRepo;
    private final ValidadorApi validador;

    @GetMapping("/estudiantes")
    @Transactional(readOnly = true)
    public Pagina<EstudianteDto> listar(@RequestParam(required = false) String q,
                                        @RequestParam(required = false) Nivel nivel,
                                        @RequestParam(required = false) String grado,
                                        @RequestParam(required = false) String seccion,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "50") int size) {
        var resultado = service.buscar(q, nivel, grado, seccion, PageRequest.of(Math.max(page, 0),
                Math.min(Math.max(size, 1), 500), Sort.by("apellidoPaterno", "apellidoMaterno", "nombres")));
        return Pagina.de(resultado, EstudianteDto::de);
    }

    @GetMapping("/estudiantes/{id}")
    @Transactional(readOnly = true)
    public EstudianteDto obtener(@PathVariable Long id) {
        return EstudianteDto.de(service.obtener(id));
    }

    @PostMapping("/estudiantes")
    @ResponseStatus(HttpStatus.CREATED)
    public EstudianteDto crear(@RequestBody EstudianteRequest req, @AuthenticationPrincipal UserDetails user) {
        Estudiante e = req.aEntidad();
        prepararEgresado(e);
        if (req.apoderadoId() != null) e.setApoderado(apoderadoService.obtener(req.apoderadoId()));
        validador.validar(e);
        return EstudianteDto.de(service.crear(e, user.getUsername()));
    }

    @PutMapping("/estudiantes/{id}")
    public EstudianteDto actualizar(@PathVariable Long id, @RequestBody EstudianteRequest req) {
        Estudiante e = req.aEntidad();
        prepararEgresado(e);
        if (req.apoderadoId() != null) e.setApoderado(apoderadoService.obtener(req.apoderadoId()));
        validador.validar(e);
        return EstudianteDto.de(service.actualizar(id, e));
    }

    @DeleteMapping("/estudiantes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    /** Totales para el panel principal. */
    @GetMapping("/resumen")
    @Transactional(readOnly = true)
    public Map<String, Object> resumen() {
        Map<String, Object> r = new LinkedHashMap<>(service.resumenPorNivel());
        r.put("APODERADOS", apoderadoRepo.count());
        r.put("USUARIOS_PENDIENTES", usuarioRepo.findAll().stream().filter(u -> !Boolean.TRUE.equals(u.getActivo())).count());
        return r;
    }

    /** Listas de opciones para los formularios del frontend. */
    @GetMapping("/catalogos")
    public Map<String, Object> catalogos() {
        Map<String, Object> c = new LinkedHashMap<>();
        c.put("niveles", Nivel.values());
        c.put("gradosInicial", EstudianteController.GRADOS_INICIAL);
        c.put("gradosPrimaria", EstudianteController.GRADOS_PRIMARIA);
        c.put("gradosSecundaria", EstudianteController.GRADOS_SECUNDARIA);
        c.put("secciones", EstudianteController.SECCIONES);
        c.put("carrerasTecnicas", EstudianteController.CARRERAS_TECNICAS);
        c.put("tiposDocumento", TipoDocumento.values());
        c.put("estadosMatricula", EstadoMatricula.values());
        c.put("sexos", Sexo.values());
        c.put("parentescos", Parentesco.values());
        c.put("conceptosPago", Arrays.stream(ConceptoPago.values()).map(v -> Map.of("valor", v.name(), "etiqueta", v.getLabel())).toList());
        c.put("estadosPago", Arrays.stream(EstadoPago.values()).map(v -> Map.of("valor", v.name(), "etiqueta", v.getLabel())).toList());
        c.put("roles", Rol.values());
        return c;
    }

    private void prepararEgresado(Estudiante e) {
        if (e.getNivel() == Nivel.EGRESADO) {
            if (e.getGrado() == null || e.getGrado().isBlank()) e.setGrado("EGRESADO");
            if (e.getSeccion() == null || e.getSeccion().isBlank()) e.setSeccion("-");
        }
    }
}
