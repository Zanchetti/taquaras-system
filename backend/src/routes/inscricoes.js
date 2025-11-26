import express from 'express';
import db from '../config/database.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/dias-jogo', verificarToken, (req, res) => {
  try {
    const { data, agendamento_id } = req.body;

    const resultado = db.prepare(`
      INSERT INTO dias_jogo (data, agendamento_id)
      VALUES (?, ?)
    `).run(data, agendamento_id || null);

    res.status(201).json({
      mensagem: 'Dia de jogo criado',
      id: resultado.lastInsertRowid
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar dia de jogo', detalhes: erro.message });
  }
});

router.get('/dias-jogo', verificarToken, (req, res) => {
  try {
    const dias = db.prepare(`
      SELECT d.*, 
             COUNT(i.id) as total_inscritos
      FROM dias_jogo d
      LEFT JOIN inscricoes i ON d.id = i.dia_jogo_id AND i.confirmado = 1
      GROUP BY d.id
      ORDER BY d.data DESC
    `).all();

    res.json(dias);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar dias de jogo', detalhes: erro.message });
  }
});

router.post('/inscrever', verificarToken, (req, res) => {
  try {
    const { dia_jogo_id } = req.body;
    const usuario_id = req.usuario.id;

    const dia = db.prepare('SELECT * FROM dias_jogo WHERE id = ?').get(dia_jogo_id);
    if (!dia) {
      return res.status(404).json({ erro: 'Dia de jogo não encontrado' });
    }
    if (dia.status !== 'aberto') {
      return res.status(400).json({ erro: 'Inscrições fechadas para este dia' });
    }

    db.prepare(`
      INSERT INTO inscricoes (dia_jogo_id, usuario_id)
      VALUES (?, ?)
    `).run(dia_jogo_id, usuario_id);

    res.status(201).json({ mensagem: 'Inscrição realizada com sucesso' });
  } catch (erro) {
    if (erro.message.includes('UNIQUE')) {
      return res.status(400).json({ erro: 'Você já está inscrito neste dia' });
    }
    res.status(500).json({ erro: 'Erro ao se inscrever', detalhes: erro.message });
  }
});

router.delete('/inscrever/:dia_jogo_id', verificarToken, (req, res) => {
  try {
    const { dia_jogo_id } = req.params;
    const usuario_id = req.usuario.id;

    db.prepare(`
      DELETE FROM inscricoes 
      WHERE dia_jogo_id = ? AND usuario_id = ?
    `).run(dia_jogo_id, usuario_id);

    res.json({ mensagem: 'Inscrição cancelada' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cancelar inscrição', detalhes: erro.message });
  }
});

router.get('/inscritos/:dia_jogo_id', verificarToken, (req, res) => {
  try {
    const { dia_jogo_id } = req.params;

    const inscritos = db.prepare(`
      SELECT u.id, u.nome, u.email, i.criado_em
      FROM inscricoes i
      JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.dia_jogo_id = ? AND i.confirmado = 1
      ORDER BY i.criado_em
    `).all(dia_jogo_id);

    res.json(inscritos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar inscritos', detalhes: erro.message });
  }
});

export default router;