package com.feyalegria.estudiantes.web;

import org.springframework.stereotype.Component;

import java.util.Map;


@Component("fmt")
public class FormatoHelper {

    private static final Map<String, String> GRADOS = Map.ofEntries(
            Map.entry("GRUPO_3_ANIOS", "3 Años"),
            Map.entry("GRUPO_4_ANIOS", "4 Años"),
            Map.entry("GRUPO_5_ANIOS", "5 Años"),
            Map.entry("PRIMERO", "Primero"),
            Map.entry("SEGUNDO", "Segundo"),
            Map.entry("TERCERO", "Tercero"),
            Map.entry("CUARTO", "Cuarto"),
            Map.entry("QUINTO", "Quinto"),
            Map.entry("SEXTO", "Sexto"),
            Map.entry("EGRESADO", "Egresado")
    );

    public String grado(String valor) {
        if (valor == null) return "";
        return GRADOS.getOrDefault(valor, valor);
    }
}
