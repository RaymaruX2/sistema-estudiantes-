package com.feyalegria.estudiantes.service;

import com.feyalegria.estudiantes.domain.Apoderado;
import com.feyalegria.estudiantes.repository.ApoderadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApoderadoService {

    private final ApoderadoRepository repo;

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
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Apoderado no encontrado: " + id));
    }

    public Apoderado guardar(Apoderado a) {
        if (a.getId() == null && repo.existsByDni(a.getDni())) {
            throw new IllegalArgumentException("Ya existe un apoderado con ese DNI");
        }
        return repo.save(a);
    }

    public Apoderado actualizar(Long id, Apoderado datos) {
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

    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}
