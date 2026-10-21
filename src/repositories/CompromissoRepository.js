const { db, sql } = require('../config/database');

class CompromissoRepository {
  async listarPorUsuario(usuarioId) {
    const pool = await db.getConnection();
    const result = await pool.request()
      .input('usuarioId', sql.Int, usuarioId)
      .query('SELECT * FROM dbo.Compromisso WHERE usuario_id = @usuarioId ORDER BY data_inicio ASC');
    return result.recordset;
  }

  async criar(compromisso) {
    const pool = await db.getConnection();
    const result = await pool.request()
      .input('titulo', sql.VarChar(150), compromisso.titulo)
      .input('data_inicio', sql.DateTime, compromisso.dataInicio)
      .input('data_fim', sql.DateTime, compromisso.dataFim)
      .input('usuario_id', sql.Int, compromisso.usuarioId)
      .query(`
        INSERT INTO dbo.Compromisso (titulo, data_inicio, data_fim, usuario_id)
        OUTPUT INSERTED.id
        VALUES (@titulo, @data_inicio, @data_fim, @usuario_id)
      `);
    return result.recordset[0];
  }
}

module.exports = new CompromissoRepository();