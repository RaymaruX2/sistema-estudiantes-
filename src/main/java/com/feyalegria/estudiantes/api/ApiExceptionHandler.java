package com.feyalegria.estudiantes.api;

import com.feyalegria.estudiantes.service.RecursoNoEncontradoException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.stream.Collectors;

/** Convierte los errores de la API en respuestas JSON claras: {"error": "..."} */
@Slf4j
@RestControllerAdvice(basePackages = "com.feyalegria.estudiantes.api")
public class ApiExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> noEncontrado(RecursoNoEncontradoException e) {
        return error(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> validacion(ConstraintViolationException e) {
        String msg = e.getConstraintViolations().stream()
                .map(v -> nombreCampo(v.getPropertyPath().toString()) + ": " + v.getMessage())
                .sorted()
                .collect(Collectors.joining(" · "));
        return error(HttpStatus.BAD_REQUEST, msg);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> invalido(IllegalArgumentException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> integridad(DataIntegrityViolationException e) {
        log.warn("Conflicto de datos: {}", e.getMostSpecificCause().getMessage());
        return error(HttpStatus.CONFLICT, "No se pudo guardar: hay datos duplicados o registros relacionados.");
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Map<String, String>> formato(Exception e) {
        return error(HttpStatus.BAD_REQUEST, "Datos con formato inválido");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> general(Exception e) {
        log.error("Error inesperado en la API", e);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado en el servidor");
    }

    private static ResponseEntity<Map<String, String>> error(HttpStatus status, String mensaje) {
        return ResponseEntity.status(status).body(Map.of("error", mensaje == null ? status.getReasonPhrase() : mensaje));
    }

    private static String nombreCampo(String path) {
        return path.replaceAll("([A-Z])", " $1").toLowerCase();
    }
}
