package com.feyalegria.estudiantes.service;

import com.feyalegria.estudiantes.domain.Estudiante;
import com.feyalegria.estudiantes.domain.Nivel;
import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.repository.EstudianteRepository;
import com.feyalegria.estudiantes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class EstudianteService {

    private final EstudianteRepository repo;
    private final UsuarioRepository usuarioRepo;

    @Transactional(readOnly = true)
    public Page<Estudiante> buscar(String q, Nivel nivel, String grado, String seccion, Pageable pageable) {
        return repo.buscar(q, nivel, grado, seccion, pageable);
    }

    @Transactional(readOnly = true)
    public Estudiante obtener(Long id) {
        return repo.buscarPorIdConRelaciones(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado: " + id));
    }

    private void normalizar(Estudiante e) {
        if (e.getCodigoEstudiante() != null && e.getCodigoEstudiante().isBlank()) e.setCodigoEstudiante(null);
        if (e.getNumeroDocumento() != null) e.setNumeroDocumento(e.getNumeroDocumento().trim());
    }

    public Estudiante crear(Estudiante e, String usernameCreador) {
        normalizar(e);
        if (repo.existsByNumeroDocumento(e.getNumeroDocumento())) {
            throw new IllegalArgumentException("Ya existe un estudiante con ese número de documento");
        }
        if (e.getCodigoEstudiante() != null && !e.getCodigoEstudiante().isBlank()
                && repo.existsByCodigoEstudiante(e.getCodigoEstudiante())) {
            throw new IllegalArgumentException("Ya existe un estudiante con ese código modular");
        }
        if (usernameCreador != null) {
            Usuario u = usuarioRepo.findByUsername(usernameCreador).orElse(null);
            e.setCreadoPor(u);
        }
        return repo.save(e);
    }

    public Estudiante actualizar(Long id, Estudiante datos) {
        normalizar(datos);
        if (repo.existsByNumeroDocumentoAndIdNot(datos.getNumeroDocumento(), id)) {
            throw new IllegalArgumentException("Ya existe otro estudiante con ese número de documento");
        }
        if (datos.getCodigoEstudiante() != null && !datos.getCodigoEstudiante().isBlank()
                && repo.existsByCodigoEstudianteAndIdNot(datos.getCodigoEstudiante(), id)) {
            throw new IllegalArgumentException("Ya existe otro estudiante con ese código modular");
        }
        Estudiante e = obtener(id);
        e.setCodigoEstudiante(datos.getCodigoEstudiante());
        e.setTipoDocumento(datos.getTipoDocumento());
        e.setNumeroDocumento(datos.getNumeroDocumento());
        e.setApellidoPaterno(datos.getApellidoPaterno());
        e.setApellidoMaterno(datos.getApellidoMaterno());
        e.setNombres(datos.getNombres());
        e.setSexo(datos.getSexo());
        e.setFechaNacimiento(datos.getFechaNacimiento());
        e.setTelefono(datos.getTelefono());
        e.setDireccion(datos.getDireccion());
        e.setNivel(datos.getNivel());
        e.setGrado(datos.getGrado());
        e.setSeccion(datos.getSeccion());
        e.setAnioCursado(datos.getAnioCursado());
        e.setEstadoMatricula(datos.getEstadoMatricula());
        e.setCarreraTecnica(datos.getCarreraTecnica());
        e.setPromocion(datos.getPromocion());
        e.setApoderado(datos.getApoderado());
        return repo.save(e);
    }

    @Transactional(readOnly = true)
    public List<Estudiante> hijosDe(Long apoderadoId) {
        return repo.findHijosDeApoderado(apoderadoId);
    }

    public void eliminar(Long id) {
        if (!repo.existsById(id)) throw new RecursoNoEncontradoException("Estudiante no encontrado: " + id);
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> resumenPorNivel() {
        Map<String, Long> r = new HashMap<>();
        r.put("INICIAL", 0L);
        r.put("PRIMARIA", 0L);
        r.put("SECUNDARIA", 0L);
        r.put("EGRESADO", 0L);
        for (Object[] row : repo.contarPorNivel()) {
            r.put(row[0].toString(), ((Number) row[1]).longValue());
        }
        r.put("TOTAL", r.get("INICIAL") + r.get("PRIMARIA") + r.get("SECUNDARIA"));
        return r;
    }
}
