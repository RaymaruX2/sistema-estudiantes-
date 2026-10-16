package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.domain.ConceptoPago;
import com.feyalegria.estudiantes.domain.EstadoPago;
import com.feyalegria.estudiantes.domain.Pago;
import com.feyalegria.estudiantes.service.ApoderadoService;
import com.feyalegria.estudiantes.service.PagoService;
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
@RequestMapping("/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService service;
    private final ApoderadoService apoderadoService;

    @GetMapping
    public String listar(@RequestParam(required = false) String q, Model model) {
        List<Pago> todos = service.obtenerTodos();

        List<Pago> filtrados = todos.stream()
                .filter(p -> q == null || q.isEmpty() ||
                    p.getApoderado().getNombreCompleto().toLowerCase().contains(q.toLowerCase()) ||
                    p.getDescripcion().toLowerCase().contains(q.toLowerCase()))
                .sorted((a, b) -> b.getFechaPago().compareTo(a.getFechaPago()))
                .collect(Collectors.toList());

        model.addAttribute("pagos", filtrados);
        model.addAttribute("q", q);
        return "pagos/lista";
    }

    @GetMapping("/nuevo")
    public String formNuevo(Model model) {
        Pago pago = new Pago();
        model.addAttribute("pago", pago);
        model.addAttribute("conceptos", ConceptoPago.values());
        model.addAttribute("estados", EstadoPago.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
        return "pagos/form";
    }

    @GetMapping("/{id}/editar")
    public String formEditar(@PathVariable Long id, Model model) {
        Pago pago = service.obtener(id);
        model.addAttribute("pago", pago);
        model.addAttribute("conceptos", ConceptoPago.values());
        model.addAttribute("estados", EstadoPago.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
        return "pagos/form";
    }

    @PostMapping
    public String guardar(@Valid @ModelAttribute("pago") Pago pago,
                          BindingResult br,
                          RedirectAttributes ra,
                          Model model) {
        if (br.hasErrors()) {
            model.addAttribute("conceptos", ConceptoPago.values());
            model.addAttribute("estados", EstadoPago.values());
            model.addAttribute("apoderados", apoderadoService.listarTodos());
            return "pagos/form";
        }
        try {
            if (pago.getId() == null) {
                service.guardar(pago);
                ra.addFlashAttribute("msg", "Pago registrado");
            } else {
                service.actualizar(pago.getId(), pago);
                ra.addFlashAttribute("msg", "Pago actualizado");
            }
        } catch (IllegalArgumentException ex) {
            br.reject("error", ex.getMessage());
            model.addAttribute("conceptos", ConceptoPago.values());
            model.addAttribute("estados", EstadoPago.values());
            model.addAttribute("apoderados", apoderadoService.listarTodos());
            return "pagos/form";
        }
        return "redirect:/pagos";
    }

    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id, RedirectAttributes ra) {
        service.eliminar(id);
        ra.addFlashAttribute("msg", "Pago eliminado");
        return "redirect:/pagos";
    }
}
