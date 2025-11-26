import express from 'express';
import db from '../config/database.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verificarToken, (req, res) => {
  try {
    const { campo_id, data, hora_inicio, hora_fim, observacoes } = req.body;
    const usuario_id = req.usuario.id;

    const conflito = db.prepare(`
      SELECT * FROM agendamentos
      WHERE campo_id = ? AND data = ? AND status = 'confirmado'
      AND (
        (hora_inicio <= ? AND hora_fim > ?) OR
        (hora_inicio < ? AND hora_fim >= ?) OR
        (hora_inicio >= ? AND hora_fim <= ?)
      )
    `).get(campo_id, data, hora_inicio, hora_inicio, hora_fim, hora_fim, hora_inicio, hora_fim);

    if (conflito) {
      return res.status(400).json({ erro: 'Horário já reservado' });
    }

    const resultado = db.prepare(`
      INSERT INTO agendamentos (campo_id, data, hora_inicio, hora_fim, usuario_id, observacoes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(campo_id, data, hora_inicio, hora_fim, usuario_id, observacoes || null);

    res.status(201).json({
      mensagem: 'Agendamento realizado',
      id: resultado.lastInsertRowid
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar agendamento', detalhes: erro.message });
  }
});

router.get('/', verificarToken, (req, res) => {
  try {
    const { data } = req.query;

    let query = `
      SELECT a.*, c.nome as campo_nome, u.nome as usuario_nome
      FROM agendamentos a
      JOIN campos c ON a.campo_id = c.id
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.status = 'confirmado'
    `;

    if (data) {
      query += ` AND a.data = '${data}'`;
    }

    query += ' ORDER BY a.data, a.hora_inicio';

    const agendamentos = db.prepare(query).all();
    res.json(agendamentos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar agendamentos', detalhes: erro.message });
  }
});

router.delete('/:id', verificarToken, (req, res) => {
  try {
    const { id } = req.params;

    const agendamento = db.prepare('SELECT * FROM agendamentos WHERE id = ?').get(id);

    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    if (agendamento.usuario_id !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para cancelar este agendamento' });
    }

    db.prepare('UPDATE agendamentos SET status = ? WHERE id = ?').run('cancelado', id);

    res.json({ mensagem: 'Agendamento cancelado' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cancelar agendamento', detalhes: erro.message });
  }
});

export default router;