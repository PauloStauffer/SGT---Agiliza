package com.agiliza.security;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public final class PasswordHasher {
    private static final int ITERATIONS = 100000;
    private PasswordHasher() { }

    public static String hash(String password) {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return "pbkdf2:" + Base64.getEncoder().encodeToString(salt) + ":"
                + Base64.getEncoder().encodeToString(derive(password, salt));
    }

    public static boolean matches(String password, String encoded) {
        try {
            String[] parts = encoded.split(":");
            if (parts.length != 3 || !"pbkdf2".equals(parts[0])) return false;
            byte[] salt = Base64.getDecoder().decode(parts[1]);
            return MessageDigest.isEqual(Base64.getDecoder().decode(parts[2]), derive(password, salt));
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private static byte[] derive(String password, byte[] salt) {
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, 256))
                    .getEncoded();
        } catch (Exception ex) {
            throw new IllegalStateException("Não foi possível gerar o hash da senha.", ex);
        }
    }
}
