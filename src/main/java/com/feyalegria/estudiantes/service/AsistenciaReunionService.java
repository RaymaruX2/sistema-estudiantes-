package com.feyalegria.estudiantes.service;

import com.feyalegria.estudiantes.domain.Apoderado;
import com.feyalegria.estudiantes.domain.AsistenciaReunion;
import com.feyalegria.estudiantes.repository.ApoderadoRepository;
import com.feyalegria.estudiantes.repository.AsistenciaReunionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AsistenciaReunionService {

    private final AsistenciaReunionRepository asistenciaRepository;
    private final ApoderadoRepository apoderadoRepository;

    public AsistenciaReunion guardar(AsistenciaReunion asistencia) {
        if (asistencia.getApoderado() == null || asistencia.getApoderado().getId() == null) {
            throw new IllegalArgumentException("El apoderado es requerido");
        }
        Apoderado apoderado = apoderadoRepository.findById(asistencia.getApoderado().getId())
                .orElseThrow(() -> new IllegalArgumentException("Apoderado no encontrado"));
        asistencia.setApoderado(apoderado);
        return asistenciaRepository.save(asistencia);
    }

    public AsistenciaReunion actualizar(Long id, AsistenciaReunion asistenciaData) {
        AsistenciaReunion asistencia = asistenciaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asistencia no encontrada"));
        asistencia.setTituloReunion(asistenciaData.getTituloReunion());
        asistencia.setFechaReunion(asistenciaData.getFechaReunion());
        asistencia.setHoraReunion(asistenciaData.getHoraReunion());
        asistencia.setAsistio(asistenciaData.getAsistio());
        asistencia.setObservaciones(asistenciaData.getObservaciones());
        return asistenciaRepository.save(asistencia);
    }

    public AsistenciaReunion obtener(Long id) {
        return asistenciaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asistencia no encontrada"));
    }

    public Page<AsistenciaReunion> obtenerPorApoderado(Long apoderadoId, Pageable pageable) {
        return asistenciaRepository.findByApoderadoId(apoderadoId, pageable);
    }

    public List<AsistenciaReunion> obtenerTodosPorApoderado(Long apoderadoId) {
        return asistenciaRepository.findByApoderadoId(apoderadoId);
    }

    public List<AsistenciaReunion> obtenerTodas() {
        return asistenciaRepository.findAll();
    }

    public Long contarAsistencias(Long apoderadoId) {
        return asistenciaRepository.countAsistencias(apoderadoId);
    }

    public Long contarTotal(Long apoderadoId) {
        return asistenciaRepository.countTotal(apoderadoId);
    }

    public void eliminar(Long id) {
        asistenciaRepository.deleteById(id);
    }
}
