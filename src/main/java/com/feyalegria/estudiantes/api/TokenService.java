package com.feyalegria.estudiantes.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

/**
 * Tokens de sesión para la API: "usuario|expira" firmado con HMAC-SHA256.
 * La clave viene de APP_TOKEN_SECRET; si no se define, se genera una al arrancar
 * (los usuarios tendrán que volver a iniciar sesión cada vez que se reinicie el servidor).
 */
@Slf4j
@Service
public class TokenService {

    private static final Duration DURACION = Duration.ofHours(12);
    private static final Base64.Encoder B64 = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder B64D = Base64.getUrlDecoder();

    private final byte[] secreto;

    public TokenService(@Value("${app.token.secret:}") String secretoConfigurado) {
        if (secretoConfigurado == null || secretoConfigurado.length() < 16) {
            byte[] aleatorio = new byte[32];
            new SecureRandom().nextBytes(aleatorio);
            this.secreto = aleatorio;
            log.warn("APP_TOKEN_SECRET no está definido (o es muy corto): se usará una clave temporal.");
        } else {
            this.secreto = secretoConfigurado.getBytes(StandardCharsets.UTF_8);
        }
    }

    public String generar(String username) {
        long expira = Instant.now().plus(DURACION).getEpochSecond();
        String datos = B64.encodeToString((username + "|" + expira).getBytes(StandardCharsets.UTF_8));
        return datos + "." + firmar(datos);
    }

    /** Devuelve el usuario si el token es válido y no ha expirado. */
    public Optional<String> validar(String token) {
        if (token == null) return Optional.empty();
        int punto = token.indexOf('.');
        if (punto <= 0) return Optional.empty();
        String datos = token.substring(0, punto);
        String firma = token.substring(punto + 1);
        if (!MessageDigest.isEqual(firmar(datos).getBytes(StandardCharsets.UTF_8), firma.getBytes(StandardCharsets.UTF_8))) {
            return Optional.empty();
        }
        try {
            String plano = new String(B64D.decode(datos), StandardCharsets.UTF_8);
            int sep = plano.lastIndexOf('|');
            long expira = Long.parseLong(plano.substring(sep + 1));
            if (Instant.now().getEpochSecond() > expira) return Optional.empty();
            return Optional.of(plano.substring(0, sep));
        } catch (RuntimeException e) {
            return Optional.empty();
        }
    }

    public long segundosDeVida() {
        return DURACION.getSeconds();
    }

    private String firmar(String datos) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secreto, "HmacSHA256"));
            return B64.encodeToString(mac.doFinal(datos.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo firmar el token", e);
        }
    }
}
