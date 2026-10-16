package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.domain.Rol;
import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.service.ApoderadoService;
import com.feyalegria.estudiantes.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;
    private final ApoderadoService apoderadoService;

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("usuarios", service.listar());
        return "usuarios/lista";
    }

    @GetMapping("/nuevo")
    public String formNuevo(Model model) {
        Usuario u = new Usuario();
        u.setActivo(true);
        model.addAttribute("usuario", u);
        model.addAttribute("roles", Rol.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
        return "usuarios/form";
    }

    @GetMapping("/{id}/editar")
    public String formEditar(@PathVariable Long id, Model model) {
        model.addAttribute("usuario", service.obtener(id));
        model.addAttribute("roles", Rol.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
        return "usuarios/form";
    }

    @PostMapping
    public String guardar(@Valid @ModelAttribute("usuario") Usuario usuario,
                          BindingResult br,
                          @RequestParam(required = false) String password,
                          RedirectAttributes ra,
                          Model model) {
        if (br.hasErrors()) {
            model.addAttribute("roles", Rol.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
            return "usuarios/form";
        }
        try {
            if (usuario.getId() == null) {
                if (password == null || password.isBlank()) {
                    br.reject("error", "La contraseña es obligatoria al crear el usuario");
                    model.addAttribute("roles", Rol.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
                    return "usuarios/form";
                }
                service.crear(usuario, password);
                ra.addFlashAttribute("msg", "Usuario creado");
            } else {
                service.actualizar(usuario.getId(), usuario, password);
                ra.addFlashAttribute("msg", "Usuario actualizado");
            }
        } catch (IllegalArgumentException ex) {
            br.reject("error", ex.getMessage());
            model.addAttribute("roles", Rol.values());
        model.addAttribute("apoderados", apoderadoService.listarTodos());
            return "usuarios/form";
        }
        return "redirect:/usuarios";
    }

    @PostMapping("/{id}/aprobar")
    public String aprobar(@PathVariable Long id, RedirectAttributes ra) {
        Usuario u = service.aprobar(id);
        ra.addFlashAttribute("msg", "Cuenta de " + u.getUsername() + " aprobada");
        return "redirect:/usuarios";
    }

    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id,
                           @org.springframework.security.core.annotation.AuthenticationPrincipal
                           org.springframework.security.core.userdetails.UserDetails actual,
                           RedirectAttributes ra) {
        service.eliminar(id, actual.getUsername());
        ra.addFlashAttribute("msg", "Usuario eliminado");
        return "redirect:/usuarios";
    }
}
