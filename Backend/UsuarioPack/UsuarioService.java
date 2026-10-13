package com.mycompany.agiliza;

/** Regras do cadastro e do login. */
public class UsuarioService {

    public Usuário cadastrar(String nome, String email, String senha) {
        if (nome == null || nome.trim().length() < 2) {
            throw new IllegalArgumentException("Informe seu nome");
        }
        if (email == null || !email.trim().matches("^\\S+@\\S+\\.\\S+$")) {
            throw new IllegalArgumentException("E-mail inválido");
        }
        if (senha == null || senha.length() < 8) {
            throw new IllegalArgumentException("Use pelo menos 8 caracteres");
        }

        email = email.trim().toLowerCase();
        if (buscarPorEmail(email) != null) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado");
        }

        Usuário novo = new Usuário(null, nome.trim(), email, SenhaHasher.gerar(senha));
        return salvar(novo);
    }

    /** Devolve o usuário se e-mail e senha estiverem certos, ou null se não estiverem. */
    public Usuário autenticar(String email, String senha) {
        if (email == null || senha == null) {
            return null;
        }
        Usuário u = buscarPorEmail(email.trim().toLowerCase());
        if (u != null && SenhaHasher.conferir(senha, u.getSenha())) {
            return u;
        }
        return null; // mesma resposta para e-mail inexistente e senha errada
    }

    // ============ ÚNICOS PONTOS QUE DEPENDEM DO BANCO ============

    // TODO (banco): SELECT ... FROM usuario WHERE email = ?
    // Devolver o Usuário (id, nome, email e hash da senha) ou null se não existir.
    private Usuário buscarPorEmail(String email) {
        return null;
    }

    // TODO (banco): INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)
    // Devolver o Usuário já com o id gerado pelo banco.
    private Usuário salvar(Usuário usuario) {
        return usuario;
    }
}
