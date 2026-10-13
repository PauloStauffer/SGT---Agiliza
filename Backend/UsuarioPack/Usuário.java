package com.mycompany.agiliza;

public class Usuário {
    private Long Id_usuario;
    private String nome;
    private String email;
    private String senha; // aqui fica o HASH da senha, nunca a senha digitada

    public Usuário(Long Id_usuario, String nome, String email, String senha) {
        this.Id_usuario = Id_usuario;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public Long getId_usuario() { return Id_usuario; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getSenha() { return senha; }
}
