package com.agiliza.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Collections;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

public class AuthInterceptor implements HandlerInterceptor {
    private final JdbcTemplate jdbc;
    public AuthInterceptor(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Override public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || request.getRequestURI().equals("/api/health")) return true;
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(401, "Faça login para continuar.");
            return false;
        }
        String hash = sha256(header.substring(7));
        java.util.List<java.util.Map<String, Object>> rows = jdbc.queryForList(
                "SELECT u.id_usuario AS id, u.nome AS name, u.email, u.curso AS course, u.bio, " +
                "u.fuso_horario AS timeZone, u.idioma AS language FROM dbo.sessao_usuario s " +
                "JOIN dbo.usuario u ON u.id_usuario=s.id_usuario_fk WHERE s.token_hash=? AND s.expira_em>SYSUTCDATETIME()", hash);
        if (rows.isEmpty()) { response.sendError(401, "Sua sessão expirou. Entre novamente."); return false; }
        request.setAttribute("user", rows.get(0));
        request.setAttribute("tokenHash", hash);
        return true;
    }

    public static String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            for (byte b : digest) result.append(String.format("%02x", b));
            return result.toString();
        } catch (Exception ex) { throw new IllegalStateException(ex); }
    }
}
