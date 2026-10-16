package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.service.RecursoNoEncontradoException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Errores de las páginas web: en lugar de la página de error genérica,
 * muestra un mensaje claro o vuelve al listado con un aviso.
 */
@Slf4j
@ControllerAdvice(basePackages = "com.feyalegria.estudiantes.web")
public class WebExceptionHandler {

    @ExceptionHandler({RecursoNoEncontradoException.class, MethodArgumentTypeMismatchException.class})
    public String noEncontrado(Exception ex, Model model, HttpServletResponse res) {
        res.setStatus(404);
        model.addAttribute("titulo", "No encontrado");
        model.addAttribute("mensaje", ex instanceof RecursoNoEncontradoException
                ? ex.getMessage() : "La dirección no es válida.");
        return "error-general";
    }

    @ExceptionHandler({DataIntegrityViolationException.class, IllegalArgumentException.class})
    public String conflicto(Exception ex, HttpServletRequest req, RedirectAttributes ra, Model model, HttpServletResponse res) {
        String mensaje = ex instanceof DataIntegrityViolationException
                ? "No se pudo completar la operación porque hay datos duplicados o registros relacionados."
                : ex.getMessage();
        if (ex instanceof DataIntegrityViolationException dive) {
            log.warn("Conflicto de datos: {}", dive.getMostSpecificCause().getMessage());
        }
        // En acciones POST (eliminar, aprobar...) volver al listado con el aviso
        if ("POST".equalsIgnoreCase(req.getMethod())) {
            ra.addFlashAttribute("errorMsg", mensaje);
            String uri = req.getRequestURI().substring(req.getContextPath().length());
            String[] partes = uri.split("/");
            return "redirect:/" + (partes.length > 1 ? partes[1] : "");
        }
        res.setStatus(400);
        model.addAttribute("titulo", "No se pudo completar");
        model.addAttribute("mensaje", mensaje);
        return "error-general";
    }
}
