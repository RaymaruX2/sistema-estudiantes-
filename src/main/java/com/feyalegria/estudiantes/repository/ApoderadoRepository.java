package com.feyalegria.estudiantes.repository;

import com.feyalegria.estudiantes.domain.Apoderado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ApoderadoRepository extends JpaRepository<Apoderado, Long> {

    Optional<Apoderado> findByDni(String dni);
    boolean existsByDni(String dni);

    @Query("""
        SELECT a FROM Apoderado a
        WHERE (:q IS NULL OR :q = ''
            OR LOWER(a.dni) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(a.nombres) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(a.apellidos) LIKE LOWER(CONCAT('%', :q, '%'))
            OR a.telefono LIKE CONCAT('%', :q, '%'))
        """)
    Page<Apoderado> buscar(@Param("q") String q, Pageable pageable);

    boolean existsByDniAndIdNot(String dni, Long id);

}
