package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.domain.AsistenciaReunion;
import com.feyalegria.estudiantes.service.ApoderadoService;
import com.feyalegria.estudiantes.service.AsistenciaReunionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/asistencias")
@RequiredArgsConstructor
public class AsistenciaReunionController {

    private final AsistenciaReunionService service;
    private final ApoderadoService apoderadoService;

    @GetMapping
    public String listar(@RequestParam(required = false) String q, Model model) {
        List<AsistenciaReunion> todos = service.obtenerTodas();

        List<AsistenciaReunion> filtrados = todos.stream()
                .filter(a -> q == null || q.isEmpty() ||
                    a.getApoderado().getNombreCompleto().toLowerCase().contains(q.toLowerCase()) ||
                    a.getTituloReunion().toLowerCase().contains(q.toLowerCase()))
                .sorted((a, b) -> b.getFechaReunion().compareTo(a.getFechaReunion()))
                .collect(Collectors.toList());

        model.addAttribute("asistencias", filtrados);
        model.addAttribute("q", q);
        return "asistencias/lista";
    }

    @GetMapping("/nuevo")
    public String formNuevo(Model model) {
        AsistenciaReunion asistencia = new AsistenciaReunion();
        model.addAttribute("asistencia", asistencia);
        model.addAttribute("apoderados", apoderadoService.listarTodos());
        return "asistencias/form";
    }

    @GetMapping("/{id}/editar")
    public String formEditar(@PathVariable Long id, Model model) {
        AsistenciaReunion asistencia = service.obtener(id);
        model.addAttribute("asistencia", asistencia);
        model.addAttribute("apoderados", apoderadoService.listarTodos());
        return "asistencias/form";
    }

    @PostMapping
    public String guardar(@Valid @ModelAttribute("asistencia") AsistenciaReunion asistencia,
                          BindingResult br,
                          RedirectAttributes ra,
                          Model model) {
        if (br.hasErrors()) {
            model.addAttribute("apoderados", apoderadoService.listarTodos());
            return "asistencias/form";
        }
        try {
            if (asistencia.getId() == null) {
                service.guardar(asistencia);
                ra.addFlashAttribute("msg", "Asistencia registrada");
            } else {
                service.actualizar(asistencia.getId(), asistencia);
                ra.addFlashAttribute("msg", "Asistencia actualizada");
            }
        } catch (IllegalArgumentException ex) {
            br.reject("error", ex.getMessage());
            model.addAttribute("apoderados", apoderadoService.listarTodos());
            return "asistencias/form";
        }
        return "redirect:/asistencias";
    }

    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id, RedirectAttributes ra) {
        service.eliminar(id);
        ra.addFlashAttribute("msg", "Asistencia eliminada");
        return "redirect:/asistencias";
    }
}
