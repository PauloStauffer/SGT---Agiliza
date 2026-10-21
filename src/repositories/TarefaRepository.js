const { db, sql } = require('../config/database');

class TarefaRepository {
  async listarPorUsuario(usuarioId) {
    const pool = await db.getConnection();
    const result = await pool.request()
      .input('usuarioId', sql.Int, usuarioId)
      .query(`
        SELECT t.*, a.nome AS area_nome 
        FROM dbo.Tarefa t
        LEFT JOIN dbo.Area_da_Vida a ON t.area_id = a.id
        WHERE t.usuario_id = @usuarioId
        ORDER BY t.data_criacao DESC
      `);
    return result.recordset;
  }

  async criar(tarefa) {
    const pool = await db.getConnection();
    const result = await pool.request()
      .input('titulo', sql.VarChar(150), tarefa.titulo)
      .input('descricao', sql.Text, tarefa.descricao)
      .input('status', sql.VarChar(50), tarefa.status || 'Pendente')
      .input('usuario_id', sql.Int, tarefa.usuarioId)
      .input('area_id', sql.Int, tarefa.areaId)
      .query(`
        INSERT INTO dbo.Tarefa (titulo, descricao, status, usuario_id, area_id)
        OUTPUT INSERTED.id
        VALUES (@titulo, @descricao, @status, @usuario_id, @area_id)
      `);
    return result.recordset[0];
  }

  async atualizarStatus(id, status) {
    const pool = await db.getConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar(50), status)
      .query('UPDATE dbo.Tarefa SET status = @status WHERE id = @id');
  }
}

module.exports = new TarefaRepository();