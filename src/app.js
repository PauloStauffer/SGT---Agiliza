const express = require('express');
require('dotenv').config();

const { db } = require('./config/database');
const TarefaRepository = require('./repositories/TarefaRepository');
const CompromissoRepository = require('./repositories/CompromissoRepository');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Rota de Teste de Conexão
app.get('/api/health', async (req, res) => {
  try {
    await db.getConnection();
    res.status(200).json({ status: 'OK', message: 'Conexão com SQL Server estabelecida.' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// Exemplo de Rota: Listar Tarefas de um Usuário
app.get('/api/usuarios/:usuarioId/tarefas', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const tarefas = await TarefaRepository.listarPorUsuario(usuarioId);
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tarefas', details: err.message });
  }
});

// Exemplo de Rota: Criar Nova Tarefa
app.post('/api/tarefas', async (req, res) => {
  try {
    const novaTarefa = await TarefaRepository.criar(req.body);
    res.status(201).json(novaTarefa);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tarefa', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  try {
    await db.getConnection();
  } catch (err) {
    console.error('Aviso: Servidor subiu, mas a conexão com o banco pendente.');
  }
});