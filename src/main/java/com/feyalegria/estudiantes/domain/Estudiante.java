package com.feyalegria.estudiantes.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Entity
@Table(name = "estudiantes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 20)
    @Column(name = "codigo_estudiante", length = 20, unique = true)
    private String codigoEstudiante;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false, length = 25)
    private TipoDocumento tipoDocumento = TipoDocumento.DNI;

    @NotBlank
    @Size(max = 15)
    @Column(name = "numero_documento", nullable = false, unique = true, length = 15)
    private String numeroDocumento;

    @NotBlank
    @Size(max = 60)
    @Column(name = "apellido_paterno", nullable = false, length = 60)
    private String apellidoPaterno;

    @NotBlank
    @Size(max = 60)
    @Column(name = "apellido_materno", nullable = false, length = 60)
    private String apellidoMaterno;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String nombres;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private Sexo sexo;

    @NotNull
    @Past
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Size(max = 20)
    @Column(length = 20)
    private String telefono;

    @Size(max = 200)
    @Column(length = 200)
    private String direccion;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Nivel nivel;

    @NotBlank
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String grado;

    @NotBlank
    @Size(max = 5)
    @Column(nullable = false, length = 5)
    private String seccion;

    @NotNull
    @Column(name = "anio_cursado", nullable = false)
    private Integer anioCursado;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_matricula", nullable = false, length = 15)
    private EstadoMatricula estadoMatricula = EstadoMatricula.DEFINITIVA;

    @Size(max = 60)
    @Column(name = "carrera_tecnica", length = 60)
    private String carreraTecnica;

    @Size(max = 60)
    @Column(length = 60)
    private String promocion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apoderado_id", foreignKey = @ForeignKey(name = "fk_estudiantes_apoderado"))
    private Apoderado apoderado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creado_por", foreignKey = @ForeignKey(name = "fk_estudiantes_creado_por"))
    private Usuario creadoPor;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;

    @Transient
    public String getNombreCompleto() {
        return apellidoPaterno + " " + apellidoMaterno + ", " + nombres;
    }

    @Transient
    public int getEdad() {
        if (fechaNacimiento == null) return 0;
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }
}
