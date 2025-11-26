import express from 'express';
import db from '../config/database.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// Listar todos os usuários (apenas admin)
router.get('/', verificarToken, verificarAdmin, (req, res) => {
  try {
    const usuarios = db.prepare(`
      SELECT id, nome, email, telefone, tipo, ativo, criado_em 
      FROM usuarios
    `).all();

    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar usuários', detalhes: erro.message });
  }
});

// Buscar perfil do usuário logado
router.get('/perfil', verificarToken, (req, res) => {
  try {
    const usuario = db.prepare(`
      SELECT id, nome, email, telefone, tipo, criado_em 
      FROM usuarios 
      WHERE id = ?
    `).get(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar perfil', detalhes: erro.message });
  }
});

// Atualizar usuário
router.put('/:id', verificarToken, (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone } = req.body;

    // Verifica se é o próprio usuário ou admin
    if (req.usuario.id !== parseInt(id) && req.usuario.tipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para atualizar este usuário' });
    }

    db.prepare('UPDATE usuarios SET nome = ?, telefone = ? WHERE id = ?')
      .run(nome, telefone, id);

    res.json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: erro.message });
  }
});

export default router;