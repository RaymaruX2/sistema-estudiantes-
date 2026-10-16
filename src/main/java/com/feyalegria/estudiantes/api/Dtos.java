package com.feyalegria.estudiantes.api;

import com.feyalegria.estudiantes.domain.*;
import com.feyalegria.estudiantes.service.ApoderadoService;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.function.Function;

/** Objetos JSON que intercambia la API con el frontend. */
public final class Dtos {

    private Dtos() {
    }

    // ------------------------------------------------------------------ salida

    public record Pagina<T>(List<T> contenido, int pagina, int tamanio, long totalElementos, int totalPaginas) {
        public static <E, T> Pagina<T> de(Page<E> page, Function<E, T> mapper) {
            return new Pagina<>(page.getContent().stream().map(mapper).toList(),
                    page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
        }
    }

    public record EstudianteDto(Long id, String codigoEstudiante, TipoDocumento tipoDocumento, String numeroDocumento,
                                String apellidoPaterno, String apellidoMaterno, String nombres, String nombreCompleto,
                                Sexo sexo, LocalDate fechaNacimiento, int edad, String telefono, String direccion,
                                Nivel nivel, String grado, String seccion, Integer anioCursado,
                                EstadoMatricula estadoMatricula, String carreraTecnica, String promocion,
                                Long apoderadoId, String apoderadoNombre, String apoderadoTelefono) {
        public static EstudianteDto de(Estudiante e) {
            Apoderado a = e.getApoderado();
            return new EstudianteDto(e.getId(), e.getCodigoEstudiante(), e.getTipoDocumento(), e.getNumeroDocumento(),
                    e.getApellidoPaterno(), e.getApellidoMaterno(), e.getNombres(), e.getNombreCompleto(),
                    e.getSexo(), e.getFechaNacimiento(), e.getEdad(), e.getTelefono(), e.getDireccion(),
                    e.getNivel(), e.getGrado(), e.getSeccion(), e.getAnioCursado(),
                    e.getEstadoMatricula(), e.getCarreraTecnica(), e.getPromocion(),
                    a != null ? a.getId() : null,
                    a != null ? a.getNombreCompleto() : null,
                    a != null ? a.getTelefono() : null);
        }
    }

    public record ApoderadoDto(Long id, String dni, String nombres, String apellidos, String nombreCompleto,
                               String telefono, String email, Parentesco parentesco, String direccion) {
        public static ApoderadoDto de(Apoderado a) {
            return new ApoderadoDto(a.getId(), a.getDni(), a.getNombres(), a.getApellidos(), a.getNombreCompleto(),
                    a.getTelefono(), a.getEmail(), a.getParentesco(), a.getDireccion());
        }
    }

    public record PagoDto(Long id, Long apoderadoId, String apoderadoNombre, String apoderadoDni, String descripcion,
                          BigDecimal monto, LocalDate fechaPago, ConceptoPago concepto, EstadoPago estado,
                          String comprobante, String observaciones) {
        public static PagoDto de(Pago p) {
            Apoderado a = p.getApoderado();
            return new PagoDto(p.getId(), a.getId(), a.getNombreCompleto(), a.getDni(), p.getDescripcion(),
                    p.getMonto(), p.getFechaPago(), p.getConcepto(), p.getEstado(), p.getComprobante(), p.getObservaciones());
        }
    }

    public record AsistenciaDto(Long id, Long apoderadoId, String apoderadoNombre, String apoderadoDni,
                                String tituloReunion, LocalDate fechaReunion, LocalTime horaReunion,
                                Boolean asistio, String observaciones) {
        public static AsistenciaDto de(AsistenciaReunion r) {
            Apoderado a = r.getApoderado();
            return new AsistenciaDto(r.getId(), a.getId(), a.getNombreCompleto(), a.getDni(), r.getTituloReunion(),
                    r.getFechaReunion(), r.getHoraReunion(), r.getAsistio(), r.getObservaciones());
        }
    }

    public record UsuarioDto(Long id, String username, String nombreCompleto, String email, Rol rol, Boolean activo,
                             Long apoderadoId, String apoderadoNombre, LocalDateTime creadoEn) {
        public static UsuarioDto de(Usuario u) {
            Apoderado a = u.getApoderado();
            return new UsuarioDto(u.getId(), u.getUsername(), u.getNombreCompleto(), u.getEmail(), u.getRol(),
                    u.getActivo(), a != null ? a.getId() : null, a != null ? a.getNombreCompleto() : null, u.getCreadoEn());
        }
    }

    public record DetalleApoderadoDto(ApoderadoDto apoderado, List<EstudianteDto> hijos, List<PagoDto> pagos,
                                      List<AsistenciaDto> asistencias, BigDecimal totalPagado, BigDecimal totalPendiente,
                                      long reunionesAsistidas, long reunionesTotales, int porcentajeAsistencia) {
        public static DetalleApoderadoDto de(ApoderadoService.Detalle d) {
            return new DetalleApoderadoDto(ApoderadoDto.de(d.apoderado()),
                    d.hijos().stream().map(EstudianteDto::de).toList(),
                    d.pagos().stream().map(PagoDto::de).toList(),
                    d.asistencias().stream().map(AsistenciaDto::de).toList(),
                    d.totalPagado(), d.totalPendiente(), d.reunionesAsistidas(), d.reunionesTotales(),
                    d.porcentajeAsistencia());
        }
    }

    public record SesionDto(String token, long expiraEnSegundos, UsuarioDto usuario) {
    }

    public record MensajeDto(String mensaje) {
    }

    // ----------------------------------------------------------------- entrada

    public record LoginRequest(String usuario, String password) {
    }

    public record EstudianteRequest(String codigoEstudiante, TipoDocumento tipoDocumento, String numeroDocumento,
                                    String apellidoPaterno, String apellidoMaterno, String nombres, Sexo sexo,
                                    LocalDate fechaNacimiento, String telefono, String direccion, Nivel nivel,
                                    String grado, String seccion, Integer anioCursado, EstadoMatricula estadoMatricula,
                                    String carreraTecnica, String promocion, Long apoderadoId) {
        public Estudiante aEntidad() {
            Estudiante e = new Estudiante();
            e.setCodigoEstudiante(codigoEstudiante);
            e.setTipoDocumento(tipoDocumento != null ? tipoDocumento : TipoDocumento.DNI);
            e.setNumeroDocumento(numeroDocumento);
            e.setApellidoPaterno(mayus(apellidoPaterno));
            e.setApellidoMaterno(mayus(apellidoMaterno));
            e.setNombres(mayus(nombres));
            e.setSexo(sexo);
            e.setFechaNacimiento(fechaNacimiento);
            e.setTelefono(telefono);
            e.setDireccion(direccion);
            e.setNivel(nivel);
            e.setGrado(grado);
            e.setSeccion(seccion);
            e.setAnioCursado(anioCursado != null ? anioCursado : LocalDate.now().getYear());
            e.setEstadoMatricula(estadoMatricula != null ? estadoMatricula : EstadoMatricula.DEFINITIVA);
            e.setCarreraTecnica(carreraTecnica);
            e.setPromocion(promocion);
            return e;
        }
    }

    public record ApoderadoRequest(String dni, String nombres, String apellidos, String telefono, String email,
                                   Parentesco parentesco, String direccion) {
        public Apoderado aEntidad() {
            Apoderado a = new Apoderado();
            a.setDni(dni);
            a.setNombres(mayus(nombres));
            a.setApellidos(mayus(apellidos));
            a.setTelefono(telefono);
            a.setEmail(email);
            a.setParentesco(parentesco);
            a.setDireccion(direccion);
            return a;
        }
    }

    public record PagoRequest(Long apoderadoId, String descripcion, BigDecimal monto, LocalDate fechaPago,
                              ConceptoPago concepto, EstadoPago estado, String comprobante, String observaciones) {
        public Pago aEntidad() {
            Pago p = new Pago();
            p.setApoderado(referencia(apoderadoId));
            p.setDescripcion(descripcion);
            p.setMonto(monto);
            p.setFechaPago(fechaPago);
            p.setConcepto(concepto);
            p.setEstado(estado != null ? estado : EstadoPago.PENDIENTE);
            p.setComprobante(comprobante);
            p.setObservaciones(observaciones);
            return p;
        }
    }

    public record AsistenciaRequest(Long apoderadoId, String tituloReunion, LocalDate fechaReunion,
                                    LocalTime horaReunion, Boolean asistio, String observaciones) {
        public AsistenciaReunion aEntidad() {
            AsistenciaReunion r = new AsistenciaReunion();
            r.setApoderado(referencia(apoderadoId));
            r.setTituloReunion(tituloReunion);
            r.setFechaReunion(fechaReunion);
            r.setHoraReunion(horaReunion);
            r.setAsistio(asistio != null ? asistio : Boolean.FALSE);
            r.setObservaciones(observaciones);
            return r;
        }
    }

    public record UsuarioRequest(String username, String nombreCompleto, String email, Rol rol, Boolean activo,
                                 String password, Long apoderadoId) {
        public Usuario aEntidad() {
            Usuario u = new Usuario();
            u.setUsername(username);
            u.setNombreCompleto(nombreCompleto);
            u.setEmail(email);
            u.setRol(rol);
            u.setActivo(activo != null ? activo : Boolean.TRUE);
            u.setApoderado(referencia(apoderadoId));
            return u;
        }
    }

    private static Apoderado referencia(Long id) {
        if (id == null) return null;
        Apoderado a = new Apoderado();
        a.setId(id);
        return a;
    }

    private static String mayus(String s) {
        return s == null ? null : s.trim().toUpperCase();
    }
}
