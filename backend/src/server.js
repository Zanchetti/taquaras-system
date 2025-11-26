import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importa rotas
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import teamsRoutes from './routes/teams.js';
import inscricoesRoutes from './routes/inscricoes.js';
import camposRoutes from './routes/campos.js';
import agendamentosRoutes from './routes/agendamentos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/inscricoes', inscricoesRoutes);
app.use('/api/campos', camposRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ mensagem: '🏆 API ADC Taquaras rodando!' });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API disponível em http://localhost:${PORT}/api\n`);
});