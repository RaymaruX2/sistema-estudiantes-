package com.feyalegria.estudiantes.domain;

public enum EstadoPago {
    PAGADO("Pagado", "success"),
    PENDIENTE("Pendiente", "warning"),
    ATRASADO("Atrasado", "danger");

    private final String label;
    private final String bootstrap;

    EstadoPago(String label, String bootstrap) {
        this.label = label;
        this.bootstrap = bootstrap;
    }

    public String getLabel() {
        return label;
    }

    public String getBootstrap() {
        return bootstrap;
    }
}
