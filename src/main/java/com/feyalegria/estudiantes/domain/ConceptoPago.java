package com.feyalegria.estudiantes.domain;

public enum ConceptoPago {
    PENSION("Pensión"),
    CUOTA_EXTRA("Cuota Extra"),
    UNIFORME("Uniforme"),
    MATERIALES("Materiales"),
    OTRO("Otro");

    private final String label;

    ConceptoPago(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
