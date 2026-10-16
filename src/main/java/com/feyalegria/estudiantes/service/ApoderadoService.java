package com.feyalegria.estudiantes.service;

import com.feyalegria.estudiantes.domain.Apoderado;
import com.feyalegria.estudiantes.domain.AsistenciaReunion;
import com.feyalegria.estudiantes.domain.Estudiante;
import com.feyalegria.estudiantes.domain.Pago;
import com.feyalegria.estudiantes.repository.ApoderadoRepository;
import com.feyalegria.estudiantes.repository.AsistenciaReunionRepository;
import com.feyalegria.estudiantes.repository.EstudianteRepository;
import com.feyalegria.estudiantes.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApoderadoService {

    private final ApoderadoRepository repo;
    private final EstudianteRepository estudianteRepo;
    private final PagoRepository pagoRepo;
    private final AsistenciaReunionRepository asistenciaRepo;

    /** Todo lo relacionado a un apoderado: sus hijos, pagos y asistencias. */
    public record Detalle(Apoderado apoderado,
                          List<Estudiante> hijos,
                          List<Pago> pagos,
                          List<AsistenciaReunion> asistencias,
                          BigDecimal totalPagado,
                          BigDecimal totalPendiente,
                          long reunionesAsistidas,
                          long reunionesTotales) {
        public int porcentajeAsistencia() {
            return reunionesTotales == 0 ? 0 : (int) Math.round(reunionesAsistidas * 100.0 / reunionesTotales);
        }
    }

    @Transactional(readOnly = true)
    public Page<Apoderado> buscar(String q, Pageable pageable) {
        return repo.buscar(q, pageable);
    }

    @Transactional(readOnly = true)
    public List<Apoderado> listarTodos() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Apoderado obtener(Long id) {
        return repo.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Apoderado no encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public Detalle detalle(Long id) {
        Apoderado a = obtener(id);
        BigDecimal pagado = pagoRepo.totalPagado(id);
        BigDecimal pendiente = pagoRepo.totalPendiente(id);
        Long asistidas = asistenciaRepo.countAsistencias(id);
        Long totales = asistenciaRepo.countTotal(id);
        return new Detalle(a,
                estudianteRepo.findHijosDeApoderado(id),
                pagoRepo.findByApoderadoId(id),
                asistenciaRepo.findByApoderadoId(id),
                pagado != null ? pagado : BigDecimal.ZERO,
                pendiente != null ? pendiente : BigDecimal.ZERO,
                asistidas != null ? asistidas : 0,
                totales != null ? totales : 0);
    }

    public Apoderado guardar(Apoderado a) {
        normalizar(a);
        if (a.getId() == null && repo.existsByDni(a.getDni())) {
            throw new IllegalArgumentException("Ya existe un apoderado con ese DNI");
        }
        return repo.save(a);
    }

    public Apoderado actualizar(Long id, Apoderado datos) {
        normalizar(datos);
        if (repo.existsByDniAndIdNot(datos.getDni(), id)) {
            throw new IllegalArgumentException("Ya existe otro apoderado con ese DNI");
        }
        Apoderado a = obtener(id);
        a.setDni(datos.getDni());
        a.setNombres(datos.getNombres());
        a.setApellidos(datos.getApellidos());
        a.setTelefono(datos.getTelefono());
        a.setEmail(datos.getEmail());
        a.setParentesco(datos.getParentesco());
        a.setDireccion(datos.getDireccion());
        return repo.save(a);
    }

    /**
     * Elimina al apoderado. Sus pagos y asistencias se borran con él (lo define la base de datos)
     * y sus hijos quedan sin apoderado asignado.
     */
    public void eliminar(Long id) {
        obtener(id);
        repo.deleteById(id);
    }

    private void normalizar(Apoderado a) {
        if (a.getDni() != null) a.setDni(a.getDni().trim());
        if (a.getEmail() != null && a.getEmail().isBlank()) a.setEmail(null);
    }
}
