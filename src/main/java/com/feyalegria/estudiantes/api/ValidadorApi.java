package com.feyalegria.estudiantes.api;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

/** Aplica las mismas reglas de validación de las entidades (@NotBlank, @Size, etc.) a los datos de la API. */
@Component
@RequiredArgsConstructor
public class ValidadorApi {

    private final Validator validator;

    public <T> T validar(T objeto) {
        Set<ConstraintViolation<T>> errores = validator.validate(objeto);
        if (!errores.isEmpty()) throw new ConstraintViolationException(errores);
        return objeto;
    }
}
