package com.feyalegria.estudiantes.repository;

import com.feyalegria.estudiantes.domain.Pago;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    @Query("SELECT p FROM Pago p WHERE p.apoderado.id = :apoderadoId ORDER BY p.fechaPago DESC")
    Page<Pago> findByApoderadoId(@Param("apoderadoId") Long apoderadoId, Pageable pageable);

    @Query("SELECT p FROM Pago p WHERE p.apoderado.id = :apoderadoId ORDER BY p.fechaPago DESC")
    List<Pago> findByApoderadoId(@Param("apoderadoId") Long apoderadoId);

    @Query("SELECT SUM(p.monto) FROM Pago p WHERE p.apoderado.id = :apoderadoId AND p.estado = 'PAGADO'")
    BigDecimal totalPagado(@Param("apoderadoId") Long apoderadoId);

    @Query("SELECT SUM(p.monto) FROM Pago p WHERE p.apoderado.id = :apoderadoId AND p.estado IN ('PENDIENTE', 'ATRASADO')")
    BigDecimal totalPendiente(@Param("apoderadoId") Long apoderadoId);

    @Query("SELECT p FROM Pago p WHERE p.fechaPago BETWEEN :inicio AND :fin ORDER BY p.fechaPago DESC")
    List<Pago> findByDateRange(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
}
