import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicializa o banco de dados SQLite
const db = new Database(join(__dirname, '../../database.sqlite'));

// Habilita foreign keys
db.pragma('foreign_keys = ON');

// Criação das tabelas
const initDatabase = () => {
  // Tabela de usuários
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      telefone TEXT,
      tipo TEXT DEFAULT 'jogador' CHECK(tipo IN ('jogador', 'admin')),
      ativo INTEGER DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de campos
  db.exec(`
    CREATE TABLE IF NOT EXISTS campos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      localizacao TEXT,
      tipo TEXT,
      valor_hora REAL,
      ativo INTEGER DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de agendamentos
  db.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campo_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fim TEXT NOT NULL,
      usuario_id INTEGER NOT NULL,
      status TEXT DEFAULT 'confirmado' CHECK(status IN ('confirmado', 'cancelado')),
      observacoes TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campo_id) REFERENCES campos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  // Tabela de dias de jogo
  db.exec(`
    CREATE TABLE IF NOT EXISTS dias_jogo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      agendamento_id INTEGER,
      status TEXT DEFAULT 'aberto' CHECK(status IN ('aberto', 'fechado', 'realizado')),
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
    )
  `);

  // Tabela de inscrições
  db.exec(`
    CREATE TABLE IF NOT EXISTS inscricoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dia_jogo_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      confirmado INTEGER DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dia_jogo_id) REFERENCES dias_jogo(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      UNIQUE(dia_jogo_id, usuario_id)
    )
  `);

  // Tabela de equipes geradas
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dia_jogo_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      cor TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dia_jogo_id) REFERENCES dias_jogo(id) ON DELETE CASCADE
    )
  `);

  // Tabela de jogadores das equipes
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipe_jogadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  console.log('✅ Banco de dados inicializado com sucesso!');
};

initDatabase();

export default db;