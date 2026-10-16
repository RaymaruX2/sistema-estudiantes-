package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.domain.Apoderado;
import com.feyalegria.estudiantes.domain.Parentesco;
import com.feyalegria.estudiantes.service.ApoderadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/apoderados")
@RequiredArgsConstructor
public class ApoderadoController {

    private final ApoderadoService service;

    @GetMapping
    public String listar(@RequestParam(required = false) String q,
                         @RequestParam(defaultValue = "0") int page,
                         Model model) {
        Page<Apoderado> resultados = service.buscar(q,
                PageRequest.of(page, 20, Sort.by("apellidos", "nombres")));
        model.addAttribute("apoderados", resultados);
        model.addAttribute("q", q);
        return "apoderados/lista";
    }

    @GetMapping("/nuevo")
    public String formNuevo(Model model) {
        model.addAttribute("apoderado", new Apoderado());
        model.addAttribute("parentescos", Parentesco.values());
        return "apoderados/form";
    }

    @GetMapping("/{id}/editar")
    public String formEditar(@PathVariable Long id, Model model) {
        model.addAttribute("apoderado", service.obtener(id));
        model.addAttribute("parentescos", Parentesco.values());
        return "apoderados/form";
    }

    @PostMapping
    public String guardar(@Valid @ModelAttribute("apoderado") Apoderado apoderado,
                          BindingResult br,
                          RedirectAttributes ra,
                          Model model) {
        if (br.hasErrors()) {
            model.addAttribute("parentescos", Parentesco.values());
            return "apoderados/form";
        }
        try {
            if (apoderado.getId() == null) {
                service.guardar(apoderado);
                ra.addFlashAttribute("msg", "Apoderado registrado");
            } else {
                service.actualizar(apoderado.getId(), apoderado);
                ra.addFlashAttribute("msg", "Apoderado actualizado");
            }
        } catch (IllegalArgumentException ex) {
            br.reject("error", ex.getMessage());
            model.addAttribute("parentescos", Parentesco.values());
            return "apoderados/form";
        }
        return "redirect:/apoderados";
    }

    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id, RedirectAttributes ra) {
        service.eliminar(id);
        ra.addFlashAttribute("msg", "Apoderado eliminado");
        return "redirect:/apoderados";
    }
}
