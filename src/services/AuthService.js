const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');

const UsuarioRepository = require('../repositories/UsuarioRepository');

const scryptAsync = promisify(scrypt);
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const HASH_BYTES = 64;

class AuthError extends Error {
  constructor(message, status, field) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.field = field;
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, HASH_BYTES);
  return `scrypt:${salt}:${hash.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string') return false;

  const [algorithm, salt, hashHex] = storedHash.split(':');
  if (algorithm !== 'scrypt' || !salt || !hashHex || !/^[\da-f]+$/i.test(hashHex)) {
    return false;
  }

  const expected = Buffer.from(hashHex, 'hex');
  if (expected.length !== HASH_BYTES) return false;

  const actual = await scryptAsync(password, salt, HASH_BYTES);
  return timingSafeEqual(expected, actual);
}

function validateEmail(email) {
  return email.length <= 255 && EMAIL_PATTERN.test(email);
}

function publicUser(user) {
  return { id: user.id, name: user.nome, email: user.email };
}

class AuthService {
  async register({ name, email, password }) {
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (normalizedName.length < 2 || normalizedName.length > 255) {
      throw new AuthError('Informe um nome entre 2 e 255 caracteres.', 400, 'name');
    }
    if (!validateEmail(normalizedEmail)) {
      throw new AuthError('Informe um e-mail válido com até 255 caracteres.', 400, 'email');
    }
    if (typeof password !== 'string' || password.length < 8) {
      throw new AuthError('Use uma senha com pelo menos 8 caracteres.', 400, 'password');
    }
    if (password.length > 128) {
      throw new AuthError('A senha deve ter no máximo 128 caracteres.', 400, 'password');
    }

    const existingUser = await UsuarioRepository.buscarPorEmail(normalizedEmail);
    if (existingUser) {
      throw new AuthError('Este e-mail já está cadastrado.', 409, 'email');
    }

    const createdUser = await UsuarioRepository.criar({
      nome: normalizedName,
      email: normalizedEmail,
      senha: await hashPassword(password),
    });

    return { id: createdUser.id, name: normalizedName, email: normalizedEmail };
  }

  async login({ email, password }) {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!validateEmail(normalizedEmail)) {
      throw new AuthError('Informe um e-mail válido.', 400, 'email');
    }
    if (typeof password !== 'string' || password.length === 0 || password.length > 128) {
      throw new AuthError('Informe sua senha.', 400, 'password');
    }

    const user = await UsuarioRepository.buscarPorEmail(normalizedEmail);
    if (!user || !(await verifyPassword(password, user.senha))) {
      throw new AuthError('E-mail ou senha incorretos.', 401);
    }

    return publicUser(user);
  }
}

module.exports = { AuthError, AuthService: new AuthService() };
