package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.service.EstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final EstudianteService estudianteService;

    @GetMapping("/")
    public String home(Model model) {
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
}
