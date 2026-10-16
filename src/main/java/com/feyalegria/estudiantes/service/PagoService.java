package com.feyalegria.estudiantes.service;

import com.feyalegria.estudiantes.domain.Apoderado;
import com.feyalegria.estudiantes.domain.EstadoPago;
import com.feyalegria.estudiantes.domain.Pago;
import com.feyalegria.estudiantes.repository.ApoderadoRepository;
import com.feyalegria.estudiantes.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final ApoderadoRepository apoderadoRepository;

    public Pago guardar(Pago pago) {
        if (pago.getApoderado() == null || pago.getApoderado().getId() == null) {
            throw new IllegalArgumentException("El apoderado es requerido");
        }
        Apoderado apoderado = apoderadoRepository.findById(pago.getApoderado().getId())
                .orElseThrow(() -> new IllegalArgumentException("Apoderado no encontrado"));
        pago.setApoderado(apoderado);
        return pagoRepository.save(pago);
    }

    public Pago actualizar(Long id, Pago pagoData) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pago no encontrado"));
        pago.setDescripcion(pagoData.getDescripcion());
        pago.setMonto(pagoData.getMonto());
        pago.setFechaPago(pagoData.getFechaPago());
        pago.setConcepto(pagoData.getConcepto());
        pago.setEstado(pagoData.getEstado());
        pago.setComprobante(pagoData.getComprobante());
        pago.setObservaciones(pagoData.getObservaciones());
        if (pagoData.getApoderado() != null && pagoData.getApoderado().getId() != null) {
            pago.setApoderado(apoderadoRepository.findById(pagoData.getApoderado().getId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Apoderado no encontrado")));
        }
        return pagoRepository.save(pago);
    }

    public Pago obtener(Long id) {
        return pagoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pago no encontrado"));
    }

    public Page<Pago> obtenerPorApoderado(Long apoderadoId, Pageable pageable) {
        return pagoRepository.findByApoderadoId(apoderadoId, pageable);
    }

    public List<Pago> obtenerTodosPorApoderado(Long apoderadoId) {
        return pagoRepository.findByApoderadoId(apoderadoId);
    }

    public List<Pago> obtenerTodos() {
        return pagoRepository.findAll();
    }

    public BigDecimal totalPagado(Long apoderadoId) {
        BigDecimal total = pagoRepository.totalPagado(apoderadoId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal totalPendiente(Long apoderadoId) {
        BigDecimal total = pagoRepository.totalPendiente(apoderadoId);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public Page<Pago> buscar(String q, EstadoPago estado, Pageable pageable) {
        return pagoRepository.buscar(q, estado, pageable);
    }

    public void eliminar(Long id) {
        obtener(id);
        pagoRepository.deleteById(id);
    }
}
