package com.feyalegria.estudiantes.repository;

import com.feyalegria.estudiantes.domain.AsistenciaReunion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaReunionRepository extends JpaRepository<AsistenciaReunion, Long> {

    @Query("SELECT a FROM AsistenciaReunion a WHERE a.apoderado.id = :apoderadoId ORDER BY a.fechaReunion DESC")
    Page<AsistenciaReunion> findByApoderadoId(@Param("apoderadoId") Long apoderadoId, Pageable pageable);

    @Query("SELECT a FROM AsistenciaReunion a WHERE a.apoderado.id = :apoderadoId ORDER BY a.fechaReunion DESC")
    List<AsistenciaReunion> findByApoderadoId(@Param("apoderadoId") Long apoderadoId);

    @Query("SELECT COUNT(a) FROM AsistenciaReunion a WHERE a.apoderado.id = :apoderadoId AND a.asistio = true")
    Long countAsistencias(@Param("apoderadoId") Long apoderadoId);

    @Query("SELECT COUNT(a) FROM AsistenciaReunion a WHERE a.apoderado.id = :apoderadoId")
    Long countTotal(@Param("apoderadoId") Long apoderadoId);

    @Query("SELECT a FROM AsistenciaReunion a WHERE a.fechaReunion BETWEEN :inicio AND :fin ORDER BY a.fechaReunion DESC")
    List<AsistenciaReunion> findByDateRange(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    @Query(value = """
        SELECT r FROM AsistenciaReunion r JOIN r.apoderado a
        WHERE (:q IS NULL OR :q = ''
            OR LOWER(CONCAT(a.nombres, ' ', a.apellidos)) LIKE LOWER(CONCAT('%', :q, '%'))
            OR a.dni LIKE CONCAT('%', :q, '%')
            OR LOWER(r.tituloReunion) LIKE LOWER(CONCAT('%', :q, '%')))
        """,
        countQuery = """
        SELECT COUNT(r) FROM AsistenciaReunion r JOIN r.apoderado a
        WHERE (:q IS NULL OR :q = ''
            OR LOWER(CONCAT(a.nombres, ' ', a.apellidos)) LIKE LOWER(CONCAT('%', :q, '%'))
            OR a.dni LIKE CONCAT('%', :q, '%')
            OR LOWER(r.tituloReunion) LIKE LOWER(CONCAT('%', :q, '%')))
        """)
    Page<AsistenciaReunion> buscar(@Param("q") String q, Pageable pageable);

    long countByApoderadoId(Long apoderadoId);

}
