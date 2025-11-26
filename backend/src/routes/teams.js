import express from 'express';
import db from '../config/database.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Gerar equipes aleatoriamente
router.post('/gerar/:dia_jogo_id', verificarToken, (req, res) => {
  try {
    const { dia_jogo_id } = req.params;
    const { quantidade_times } = req.body;

    // Busca inscritos
    const inscritos = db.prepare(`
      SELECT u.id, u.nome
      FROM inscricoes i
      JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.dia_jogo_id = ? AND i.confirmado = 1
    `).all(dia_jogo_id);

    if (inscritos.length === 0) {
      return res.status(400).json({ erro: 'Nenhum inscrito encontrado' });
    }

    // Remove equipes antigas deste dia
    db.prepare('DELETE FROM equipes WHERE dia_jogo_id = ?').run(dia_jogo_id);

    // Embaralha jogadores
    const jogadoresEmbaralhados = inscritos.sort(() => Math.random() - 0.5);

    const cores = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Laranja', 'Roxo'];
    const numTimes = quantidade_times || 2;
    const jogadoresPorTime = Math.ceil(jogadoresEmbaralhados.length / numTimes);

    const equipes = [];

    for (let i = 0; i < numTimes; i++) {
      // Cria equipe
      const resultado = db.prepare(`
        INSERT INTO equipes (dia_jogo_id, nome, cor)
        VALUES (?, ?, ?)
      `).run(dia_jogo_id, `Time ${i + 1}`, cores[i]);

      const equipeId = resultado.lastInsertRowid;
      const inicio = i * jogadoresPorTime;
      const fim = Math.min(inicio + jogadoresPorTime, jogadoresEmbaralhados.length);
      const jogadoresTime = jogadoresEmbaralhados.slice(inicio, fim);

      // Adiciona jogadores à equipe
      const insertJogador = db.prepare(`
        INSERT INTO equipe_jogadores (equipe_id, usuario_id)
        VALUES (?, ?)
      `);

      jogadoresTime.forEach(jogador => {
        insertJogador.run(equipeId, jogador.id);
      });

      equipes.push({
        id: equipeId,
        nome: `Time ${i + 1}`,
        cor: cores[i],
        jogadores: jogadoresTime
      });
    }

    res.json({
      mensagem: 'Equipes geradas com sucesso',
      equipes
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao gerar equipes', detalhes: erro.message });
  }
});

// Listar equipes de um dia
router.get('/:dia_jogo_id', verificarToken, (req, res) => {
  try {
    const { dia_jogo_id } = req.params;

    const equipes = db.prepare(`
      SELECT e.*, 
             GROUP_CONCAT(u.nome) as jogadores_nomes,
             COUNT(ej.id) as total_jogadores
      FROM equipes e
      LEFT JOIN equipe_jogadores ej ON e.id = ej.equipe_id
      LEFT JOIN usuarios u ON ej.usuario_id = u.id
      WHERE e.dia_jogo_id = ?
      GROUP BY e.id
    `).all(dia_jogo_id);

    // Busca detalhes dos jogadores para cada equipe
    equipes.forEach(equipe => {
      const jogadores = db.prepare(`
        SELECT u.id, u.nome
        FROM equipe_jogadores ej
        JOIN usuarios u ON ej.usuario_id = u.id
        WHERE ej.equipe_id = ?
      `).all(equipe.id);

      equipe.jogadores = jogadores;
    });

    res.json(equipes);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar equipes', detalhes: erro.message });
  }
});

export default router;