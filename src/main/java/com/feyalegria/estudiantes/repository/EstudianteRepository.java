package com.feyalegria.estudiantes.repository;

import com.feyalegria.estudiantes.domain.Estudiante;
import com.feyalegria.estudiantes.domain.Nivel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    Optional<Estudiante> findByNumeroDocumento(String numeroDocumento);
    boolean existsByNumeroDocumento(String numeroDocumento);
    boolean existsByCodigoEstudiante(String codigoEstudiante);

  
    @Query("""
        SELECT e FROM Estudiante e
        LEFT JOIN FETCH e.apoderado
        LEFT JOIN FETCH e.creadoPor
        WHERE e.id = :id
        """)
    Optional<Estudiante> buscarPorIdConRelaciones(@Param("id") Long id);

    @Query("""
        SELECT e FROM Estudiante e
        WHERE (:q IS NULL OR :q = ''
            OR LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(e.nombres) LIKE LOWER(CONCAT('%', :q, '%'))
            OR e.numeroDocumento LIKE CONCAT('%', :q, '%'))
          AND (:nivel IS NULL OR e.nivel = :nivel)
          AND (:grado IS NULL OR :grado = '' OR e.grado = :grado)
          AND (:seccion IS NULL OR :seccion = '' OR e.seccion = :seccion)
        """)
    Page<Estudiante> buscar(@Param("q") String q,
                            @Param("nivel") Nivel nivel,
                            @Param("grado") String grado,
                            @Param("seccion") String seccion,
                            Pageable pageable);

    @Query("SELECT e.nivel, COUNT(e) FROM Estudiante e GROUP BY e.nivel")
    List<Object[]> contarPorNivel();
}
