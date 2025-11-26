import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = express.Router();

router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }

    const usuarioExistente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = db.prepare(`
      INSERT INTO usuarios (nome, email, senha, telefone, tipo)
      VALUES (?, ?, ?, ?, ?)
    `).run(nome, email, senhaHash, telefone || null, tipo || 'jogador');

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: { id: resultado.lastInsertRowid, nome, email }
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: erro.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1').get(email);

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao fazer login', detalhes: erro.message });
  }
});

export default router;