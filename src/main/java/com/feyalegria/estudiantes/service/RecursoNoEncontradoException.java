package com.feyalegria.estudiantes.service;

/**
 * Se lanza cuando se busca un registro (estudiante, apoderado, pago...) que no existe.
 * Extiende IllegalArgumentException para que el código existente que ya la captura siga funcionando.
 */
public class RecursoNoEncontradoException extends IllegalArgumentException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
