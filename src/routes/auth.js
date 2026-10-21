const express = require('express');
const { AuthError, AuthService } = require('../services/AuthService');

const router = express.Router();

function handleAuthError(error, res) {
  if (error instanceof AuthError) {
    return res.status(error.status).json({
      message: error.message,
      ...(error.field ? { field: error.field } : {}),
    });
  }

  if (error.number === 2601 || error.number === 2627) {
    return res.status(409).json({
      message: 'Este e-mail já está cadastrado.',
      field: 'email',
    });
  }

  console.error('Erro na autenticação:', error);
  return res.status(500).json({ message: 'Não foi possível concluir a solicitação.' });
}

router.post('/register', async (req, res) => {
  try {
    const user = await AuthService.register(req.body ?? {});
    return res.status(201).json({ user });
  } catch (error) {
    return handleAuthError(error, res);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await AuthService.login(req.body ?? {});
    return res.status(200).json({ user });
  } catch (error) {
    return handleAuthError(error, res);
  }
});

module.exports = router;
