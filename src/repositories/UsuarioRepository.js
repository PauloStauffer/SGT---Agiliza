const { db, sql } = require('../config/database');

class UsuarioRepository {
  async buscarPorId(id) {
    const pool = await db.getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id_usuario AS id, nome, email FROM dbo.usuario WHERE id_usuario = @id');
    return result.recordset[0];
  }

  async buscarPorEmail(email) {
    const pool = await db.getConnection();
    const result = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT id_usuario AS id, nome, email, senha FROM dbo.usuario WHERE email = @email');
    return result.recordset[0];
  }

  async criar(usuario) {
    const pool = await db.getConnection();
    const result = await pool.request()
      .input('nome', sql.VarChar(255), usuario.nome)
      .input('email', sql.VarChar(255), usuario.email)
      .input('senha', sql.VarChar(255), usuario.senha)
      .query(`
        INSERT INTO dbo.usuario (nome, email, senha)
        OUTPUT INSERTED.id_usuario AS id
        VALUES (@nome, @email, @senha)
      `);
    return result.recordset[0];
  }
}

module.exports = new UsuarioRepository();