package com.feyalegria.estudiantes.repository;

import com.feyalegria.estudiantes.domain.Rol;
import com.feyalegria.estudiantes.domain.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    long countByRolAndActivoTrue(Rol rol);

    boolean existsByApoderadoId(Long apoderadoId);

    boolean existsByApoderadoIdAndIdNot(Long apoderadoId, Long id);

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.apoderado WHERE u.username = :username")
    Optional<Usuario> findConApoderado(@Param("username") String username);

    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.apoderado ORDER BY u.activo ASC, u.username ASC")
    List<Usuario> listarConApoderado();

}
