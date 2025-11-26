import express from 'express';
import db from '../config/database.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// Listar campos
router.get('/', verificarToken, (req, res) => {
  try {
    const campos = db.prepare('SELECT * FROM campos WHERE ativo = 1').all();
    res.json(campos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar campos', detalhes: erro.message });
  }
});

// Criar campo (apenas admin)
router.post('/', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { nome, localizacao, tipo, valor_hora } = req.body;

    const resultado = db.prepare(`
      INSERT INTO campos (nome, localizacao, tipo, valor_hora)
      VALUES (?, ?, ?, ?)
    `).run(nome, localizacao, tipo, valor_hora);

    res.status(201).json({
      mensagem: 'Campo cadastrado',
      id: resultado.lastInsertRowid
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar campo', detalhes: erro.message });
  }
});

// Atualizar campo
router.put('/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { nome, localizacao, tipo, valor_hora } = req.body;

    db.prepare(`
      UPDATE campos 
      SET nome = ?, localizacao = ?, tipo = ?, valor_hora = ?
      WHERE id = ?
    `).run(nome, localizacao, tipo, valor_hora, id);

    res.json({ mensagem: 'Campo atualizado' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar campo', detalhes: erro.message });
  }
});

// Deletar campo
router.delete('/:id', verificarToken, verificarAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE campos SET ativo = 0 WHERE id = ?').run(id);
    res.json({ mensagem: 'Campo desativado' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao desativar campo', detalhes: erro.message });
  }
});

export default router;