package com.mycompany.agiliza;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * Transforma a senha em um "hash" para guardar.
 * Ninguém consegue recuperar a senha original a partir dele.
 */
public class SenhaHasher {
    private static final int ITERACOES = 100000;

    // Gera algo como "salt:hash" (o salt é um texto aleatório diferente para cada usuário)
    public static String gerar(String senha) {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        byte[] hash = calcular(senha, salt);
        return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
    }

    // Confere se a senha digitada gera o mesmo hash que está guardado
    public static boolean conferir(String senha, String guardado) {
        String[] partes = guardado.split(":");
        byte[] salt = Base64.getDecoder().decode(partes[0]);
        byte[] esperado = Base64.getDecoder().decode(partes[1]);
        return MessageDigest.isEqual(esperado, calcular(senha, salt));
    }

    private static byte[] calcular(String senha, byte[] salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(senha.toCharArray(), salt, ITERACOES, 256);
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash da senha", e);
        }
    }
}
