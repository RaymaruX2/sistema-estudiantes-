package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.service.EstudianteService;
import com.feyalegria.estudiantes.service.UsuarioService;
import com.feyalegria.estudiantes.service.UsuarioService.SolicitudRegistro;
import com.feyalegria.estudiantes.domain.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final EstudianteService estudianteService;
    private final UsuarioService usuarioService;

    @GetMapping("/")
    public String home(Model model, Authentication auth) {
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PADRE"))) {
            return "redirect:/mi-familia";
        }
        model.addAttribute("resumen", estudianteService.resumenPorNivel());
        return "home";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/acceso-denegado")
    public String accesoDenegado() {
        return "acceso-denegado";
    }

    // ------------------------------------------------------------ registro

    /** Datos del formulario de registro (clase mutable para enlazar con Thymeleaf). */
    @lombok.Data
    public static class FormRegistro {
        private String tipo = "PADRE";
        private String nombreCompleto;
        private String dni;
        private String username;
        private String email;
        private String password;
        private String confirmarPassword;

        SolicitudRegistro aSolicitud() {
            return new SolicitudRegistro(tipo, nombreCompleto, dni, username, email, password, confirmarPassword);
        }
    }

    @GetMapping("/registro")
    public String registro(Model model) {
        model.addAttribute("form", new FormRegistro());
        return "registro";
    }

    @PostMapping("/registro")
    public String registrar(@ModelAttribute("form") FormRegistro form, Model model, RedirectAttributes ra) {
        try {
            Usuario u = usuarioService.registrar(form.aSolicitud());
            if (Boolean.TRUE.equals(u.getActivo())) {
                ra.addFlashAttribute("registroOk", "Cuenta creada. Inicia sesión con tu DNI (" + u.getUsername() + ") o tu email.");
            } else {
                ra.addFlashAttribute("registroOk", "Solicitud enviada. Un administrador debe aprobar tu cuenta antes de que puedas ingresar.");
            }
            return "redirect:/login";
        } catch (IllegalArgumentException ex) {
            form.setPassword(null);
            form.setConfirmarPassword(null);
            model.addAttribute("error", ex.getMessage());
            return "registro";
        }
    }
}
