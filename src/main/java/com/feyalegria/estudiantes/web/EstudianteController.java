package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.domain.*;
import com.feyalegria.estudiantes.service.ApoderadoService;
import com.feyalegria.estudiantes.service.EstudianteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/estudiantes")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteService service;
    private final ApoderadoService apoderadoService;

    public static final java.util.List<String> CARRERAS_TECNICAS = java.util.List.of(
            "Computación e Informática",
            "Contabilidad",
            "Electrónica Industrial",
            "Gastronomía",
            "Mecánica Automotriz",
            "Diseño Industrial",
            "Confección Textil",
            "Carpintería"
    );

    public static final java.util.List<String> GRADOS_INICIAL =
            java.util.List.of("GRUPO_3_ANIOS", "GRUPO_4_ANIOS", "GRUPO_5_ANIOS");
    public static final java.util.List<String> GRADOS_PRIMARIA =
            java.util.List.of("PRIMERO", "SEGUNDO", "TERCERO", "CUARTO", "QUINTO", "SEXTO");
    public static final java.util.List<String> GRADOS_SECUNDARIA =
            java.util.List.of("PRIMERO", "SEGUNDO", "TERCERO", "CUARTO", "QUINTO");
    public static final java.util.List<String> SECCIONES =
            java.util.List.of("A", "B", "C", "D", "E");

    private static java.util.List<String> gradosPara(Nivel nivel) {
        if (nivel == Nivel.INICIAL) return GRADOS_INICIAL;
        if (nivel == Nivel.PRIMARIA) return GRADOS_PRIMARIA;
        if (nivel == Nivel.SECUNDARIA) return GRADOS_SECUNDARIA;
        if (nivel == Nivel.EGRESADO) return java.util.List.of();
        java.util.List<String> todos = new java.util.ArrayList<>(GRADOS_INICIAL);
        todos.addAll(GRADOS_PRIMARIA);
        return todos;
    }

    @GetMapping
    public String listar(@RequestParam(required = false) String q,
                         @RequestParam(required = false) Nivel nivel,
                         @RequestParam(required = false) String grado,
                         @RequestParam(required = false) String seccion,
                         @RequestParam(defaultValue = "0") int page,
                         Model model) {
        return render(q, nivel, grado, seccion, page, null, model);
    }

    @GetMapping("/inicial")
    public String inicial(@RequestParam(required = false) String q,
                          @RequestParam(required = false) String grado,
                          @RequestParam(required = false) String seccion,
                          @RequestParam(defaultValue = "0") int page, Model model) {
        return render(q, Nivel.INICIAL, grado, seccion, page, Nivel.INICIAL, model);
    }

    @GetMapping("/primaria")
    public String primaria(@RequestParam(required = false) String q,
                           @RequestParam(required = false) String grado,
                           @RequestParam(required = false) String seccion,
                           @RequestParam(defaultValue = "0") int page, Model model) {
        return render(q, Nivel.PRIMARIA, grado, seccion, page, Nivel.PRIMARIA, model);
    }

    @GetMapping("/secundaria")
    public String secundaria(@RequestParam(required = false) String q,
                             @RequestParam(required = false) String grado,
                             @RequestParam(required = false) String seccion,
                             @RequestParam(defaultValue = "0") int page, Model model) {
        return render(q, Nivel.SECUNDARIA, grado, seccion, page, Nivel.SECUNDARIA, model);
    }

    @GetMapping("/egresados")
    public String egresados(@RequestParam(required = false) String q,
                            @RequestParam(required = false) String grado,
                            @RequestParam(required = false) String seccion,
                            @RequestParam(defaultValue = "0") int page, Model model) {
        return render(q, Nivel.EGRESADO, grado, seccion, page, Nivel.EGRESADO, model);
    }

    private String render(String q, Nivel nivel, String grado, String seccion,
                          int page, Nivel nivelActivo, Model model) {
        Page<Estudiante> resultados = service.buscar(q, nivel, grado, seccion,
                PageRequest.of(page, 20, Sort.by("apellidoPaterno", "apellidoMaterno", "nombres")));
        model.addAttribute("estudiantes", resultados);
        model.addAttribute("q", q);
        model.addAttribute("nivel", nivel);
        model.addAttribute("grado", grado);
        model.addAttribute("seccion", seccion);
        model.addAttribute("niveles", Nivel.values());
        model.addAttribute("nivelActivo", nivelActivo);
        model.addAttribute("gradosFiltro", gradosPara(nivelActivo));
        model.addAttribute("seccionesFiltro", SECCIONES);
        return "estudiantes/lista";
    }

    @GetMapping("/{id}")
    public String detalle(@PathVariable Long id, Model model) {
        model.addAttribute("estudiante", service.obtener(id));
        return "estudiantes/detalle";
    }

    @GetMapping("/nuevo")
    public String formNuevo(@RequestParam(required = false) Nivel nivel, Model model) {
        Estudiante e = new Estudiante();
        e.setAnioCursado(java.time.Year.now().getValue());
        if (nivel != null) {
            e.setNivel(nivel);
            if (nivel == Nivel.EGRESADO) {
                e.setGrado("EGRESADO");
                e.setSeccion("-");
            }
        }
        model.addAttribute("estudiante", e);
        prepararForm(model);
        return "estudiantes/form";
    }

    @GetMapping("/{id}/editar")
    public String formEditar(@PathVariable Long id, Model model) {
        model.addAttribute("estudiante", service.obtener(id));
        prepararForm(model);
        return "estudiantes/form";
    }

    @PostMapping
    public String guardar(@Valid @ModelAttribute("estudiante") Estudiante estudiante,
                          BindingResult br,
                          @AuthenticationPrincipal UserDetails user,
                          RedirectAttributes ra,
                          Model model) {
        if (br.hasErrors()) {
            prepararForm(model);
            return "estudiantes/form";
        }
        try {
            if (estudiante.getId() == null) {
                service.crear(estudiante, user.getUsername());
                ra.addFlashAttribute("msg", "Estudiante registrado correctamente");
            } else {
                service.actualizar(estudiante.getId(), estudiante);
                ra.addFlashAttribute("msg", "Estudiante actualizado correctamente");
            }
        } catch (IllegalArgumentException ex) {
            br.reject("error", ex.getMessage());
            prepararForm(model);
            return "estudiantes/form";
        }
        return "redirect:/estudiantes";
    }

    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id, RedirectAttributes ra) {
        service.eliminar(id);
        ra.addFlashAttribute("msg", "Estudiante eliminado");
        return "redirect:/estudiantes";
    }

    private void prepararForm(Model model) {
        model.addAttribute("niveles", Nivel.values());
        model.addAttribute("sexos", Sexo.values());
        model.addAttribute("tiposDocumento", TipoDocumento.values());
        model.addAttribute("estados", EstadoMatricula.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
        model.addAttribute("carrerasTecnicas", CARRERAS_TECNICAS);
    }
}
