package com.feyalegria.estudiantes.web;

import com.feyalegria.estudiantes.domain.Usuario;
import com.feyalegria.estudiantes.service.ApoderadoService;
import com.feyalegria.estudiantes.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/** Portal del padre/apoderado: ve a sus hijos, sus pagos y su asistencia a reuniones. */
@Controller
@RequiredArgsConstructor
public class PadreController {

    private final UsuarioService usuarioService;
    private final ApoderadoService apoderadoService;

    @GetMapping("/mi-familia")
    public String miFamilia(@AuthenticationPrincipal UserDetails user, Model model) {
        Usuario u = usuarioService.buscarConApoderado(user.getUsername()).orElseThrow();
        model.addAttribute("usuario", u);
        if (u.getApoderado() != null) {
            model.addAttribute("d", apoderadoService.detalle(u.getApoderado().getId()));
        }
        return "padre/mi-familia";
    }
}
