const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'sgt_agiliza',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

class Database {
  constructor() {
    this.pool = null;
  }

  async getConnection() {
    if (!this.pool) {
      try {
        this.pool = await new sql.ConnectionPool(config).connect();
        console.log('Pool de conexões com o SQL Server estabelecido com sucesso!');
      } catch (err) {
        console.error('Erro ao conectar ao SQL Server:', err);
        this.pool = null;
        throw err;
      }
    }
    return this.pool;
  }
}

module.exports = {
  db: new Database(),
  sql,
};