// backend/src/seed.js
// Script para popular o banco de dados com dados de teste
// Execute: node src/seed.js

import bcrypt from 'bcryptjs';
import db from './config/database.js';

console.log('Iniciando seed do banco de dados...\n');

const limparDados = () => {
  console.log('Limpando dados existentes...');
  try {
    db.exec('DELETE FROM equipe_jogadores');
    db.exec('DELETE FROM equipes');
    db.exec('DELETE FROM inscricoes');
    db.exec('DELETE FROM dias_jogo');
    db.exec('DELETE FROM agendamentos');
    db.exec('DELETE FROM campos');
    db.exec('DELETE FROM usuarios');
    console.log('Dados limpos\n');
  } catch (erro) {
    console.log('⚠Tabelas ainda não existem ou já estão vazias\n');
  }
};

const criarUsuarios = async () => {
  console.log('Criando usuários...');
  
  const usuarios = [
    {
      nome: 'Admin do Sistema',
      email: 'admin@adctaquaras.com',
      senha: await bcrypt.hash('admin123', 10),
      telefone: '(47) 99999-0001',
      tipo: 'admin'
    },
    {
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0002',
      tipo: 'jogador'
    },
    {
      nome: 'Maria Santos',
      email: 'maria@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0003',
      tipo: 'jogador'
    },
    {
      nome: 'Pedro Oliveira',
      email: 'pedro@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0004',
      tipo: 'jogador'
    },
    {
      nome: 'Ana Costa',
      email: 'ana@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0005',
      tipo: 'jogador'
    },
    {
      nome: 'Carlos Ferreira',
      email: 'carlos@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0006',
      tipo: 'jogador'
    },
    {
      nome: 'Juliana Lima',
      email: 'juliana@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0007',
      tipo: 'jogador'
    },
    {
      nome: 'Roberto Alves',
      email: 'roberto@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0008',
      tipo: 'jogador'
    },
    {
      nome: 'Fernanda Souza',
      email: 'fernanda@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0009',
      tipo: 'jogador'
    },
    {
      nome: 'Lucas Martins',
      email: 'lucas@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0010',
      tipo: 'jogador'
    },
    {
      nome: 'Patricia Rocha',
      email: 'patricia@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0011',
      tipo: 'jogador'
    },
    {
      nome: 'Rafael Gomes',
      email: 'rafael@email.com',
      senha: await bcrypt.hash('123456', 10),
      telefone: '(47) 99999-0012',
      tipo: 'jogador'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO usuarios (nome, email, senha, telefone, tipo)
    VALUES (?, ?, ?, ?, ?)
  `);

  usuarios.forEach(user => {
    stmt.run(user.nome, user.email, user.senha, user.telefone, user.tipo);
  });

  console.log(`${usuarios.length} usuários criados\n`);
};

// Cria campos
const criarCampos = () => {
  console.log('Criando campos...');
  
  const campos = [
    {
      nome: 'Campo Principal ADC Taquaras',
      localizacao: 'Rua das Flores, 123 - Taquaras',
      tipo: 'Society',
      valor_hora: 150.00
    },
    {
      nome: 'Campo Secundário',
      localizacao: 'Av. Central, 456 - Taquaras',
      tipo: 'Society',
      valor_hora: 120.00
    },
    {
      nome: 'Quadra Coberta',
      localizacao: 'Rua do Esporte, 789 - Taquaras',
      tipo: 'Quadra',
      valor_hora: 100.00
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO campos (nome, localizacao, tipo, valor_hora)
    VALUES (?, ?, ?, ?)
  `);

  campos.forEach(campo => {
    stmt.run(campo.nome, campo.localizacao, campo.tipo, campo.valor_hora);
  });

  console.log(`${campos.length} campos criados\n`);
};

const criarAgendamentos = () => {
  console.log('Criando agendamentos...');
  
  const hoje = new Date();
  
  const formatarData = (diasAFrente) => {
    const data = new Date(hoje);
    data.setDate(data.getDate() + diasAFrente);
    return data.toISOString().split('T')[0];
  };

  const agendamentos = [
    {
      campo_id: 1,
      data: formatarData(3),
      hora_inicio: '19:00',
      hora_fim: '21:00',
      usuario_id: 1,
      observacoes: 'Jogo semanal - Time ADC Taquaras'
    },
    {
      campo_id: 2,
      data: formatarData(7),
      hora_inicio: '18:00',
      hora_fim: '20:00',
      usuario_id: 1,
      observacoes: 'Treino especial'
    },
    {
      campo_id: 1,
      data: formatarData(10),
      hora_inicio: '20:00',
      hora_fim: '22:00',
      usuario_id: 2,
      observacoes: 'Rachão de fim de semana'
    },
    {
      campo_id: 3,
      data: formatarData(5),
      hora_inicio: '17:00',
      hora_fim: '19:00',
      usuario_id: 1,
      observacoes: 'Jogo amistoso'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO agendamentos (campo_id, data, hora_inicio, hora_fim, usuario_id, observacoes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  agendamentos.forEach(ag => {
    stmt.run(ag.campo_id, ag.data, ag.hora_inicio, ag.hora_fim, ag.usuario_id, ag.observacoes);
  });

  console.log(`${agendamentos.length} agendamentos criados\n`);
};

const criarDiasJogo = () => {
  console.log('🏆 Criando dias de jogo...');
  
  const hoje = new Date();
  
  const formatarData = (diasAFrente) => {
    const data = new Date(hoje);
    data.setDate(data.getDate() + diasAFrente);
    return data.toISOString().split('T')[0];
  };

  const dias = [
    {
      data: formatarData(3),
      agendamento_id: 1,
      status: 'aberto'
    },
    {
      data: formatarData(5),
      agendamento_id: 4,
      status: 'aberto'
    },
    {
      data: formatarData(7),
      agendamento_id: 2,
      status: 'aberto'
    },
    {
      data: formatarData(10),
      agendamento_id: 3,
      status: 'aberto'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO dias_jogo (data, agendamento_id, status)
    VALUES (?, ?, ?)
  `);

  dias.forEach(dia => {
    stmt.run(dia.data, dia.agendamento_id, dia.status);
  });

  console.log(`${dias.length} dias de jogo criados\n`);
};

const criarInscricoes = () => {
  console.log('📝 Criando inscrições...');
  
  const inscricoes = [
    // Dia 1 - 10 jogadores
    { dia_jogo_id: 1, usuario_id: 2 },
    { dia_jogo_id: 1, usuario_id: 3 },
    { dia_jogo_id: 1, usuario_id: 4 },
    { dia_jogo_id: 1, usuario_id: 5 },
    { dia_jogo_id: 1, usuario_id: 6 },
    { dia_jogo_id: 1, usuario_id: 7 },
    { dia_jogo_id: 1, usuario_id: 8 },
    { dia_jogo_id: 1, usuario_id: 9 },
    { dia_jogo_id: 1, usuario_id: 10 },
    { dia_jogo_id: 1, usuario_id: 11 },
    
    // Dia 2 - 8 jogadores
    { dia_jogo_id: 2, usuario_id: 2 },
    { dia_jogo_id: 2, usuario_id: 4 },
    { dia_jogo_id: 2, usuario_id: 5 },
    { dia_jogo_id: 2, usuario_id: 7 },
    { dia_jogo_id: 2, usuario_id: 9 },
    { dia_jogo_id: 2, usuario_id: 10 },
    { dia_jogo_id: 2, usuario_id: 11 },
    { dia_jogo_id: 2, usuario_id: 12 },
    
    // Dia 3 - 12 jogadores
    { dia_jogo_id: 3, usuario_id: 2 },
    { dia_jogo_id: 3, usuario_id: 3 },
    { dia_jogo_id: 3, usuario_id: 4 },
    { dia_jogo_id: 3, usuario_id: 5 },
    { dia_jogo_id: 3, usuario_id: 6 },
    { dia_jogo_id: 3, usuario_id: 7 },
    { dia_jogo_id: 3, usuario_id: 8 },
    { dia_jogo_id: 3, usuario_id: 9 },
    { dia_jogo_id: 3, usuario_id: 10 },
    { dia_jogo_id: 3, usuario_id: 11 },
    { dia_jogo_id: 3, usuario_id: 12 },
    { dia_jogo_id: 3, usuario_id: 1 },
    
    // Dia 4 - 6 jogadores
    { dia_jogo_id: 4, usuario_id: 3 },
    { dia_jogo_id: 4, usuario_id: 5 },
    { dia_jogo_id: 4, usuario_id: 7 },
    { dia_jogo_id: 4, usuario_id: 9 },
    { dia_jogo_id: 4, usuario_id: 11 },
    { dia_jogo_id: 4, usuario_id: 12 }
  ];

  const stmt = db.prepare(`
    INSERT INTO inscricoes (dia_jogo_id, usuario_id)
    VALUES (?, ?)
  `);

  inscricoes.forEach(insc => {
    try {
      stmt.run(insc.dia_jogo_id, insc.usuario_id);
    } catch (erro) {
    }
  });

  console.log(`${inscricoes.length} inscrições criadas\n`);
};

const executarSeed = async () => {
  try {
    limparDados();
    await criarUsuarios();
    criarCampos();
    criarAgendamentos();
    criarDiasJogo();
    criarInscricoes();

    console.log('========================================');
    console.log('Seed concluído com sucesso!');
    console.log('========================================\n');
    console.log('Credenciais de acesso:\n');
    console.log('ADMIN:');
    console.log('   Email: admin@adctaquaras.com');
    console.log('   Senha: admin123\n');
    console.log('JOGADOR (exemplo):');
    console.log('   Email: joao@email.com');
    console.log('   Senha: 123456\n');
    console.log('Dados criados:');
    console.log('   • 12 usuários (1 admin + 11 jogadores)');
    console.log('   • 3 campos');
    console.log('   • 4 agendamentos');
    console.log('   • 4 dias de jogo');
    console.log('   • 36 inscrições\n');
    console.log('Agora inicie o servidor backend:');
    console.log('   npm run dev\n');
    console.log('E em outro terminal, inicie o frontend:');
    console.log('   cd ../frontend && npm run dev\n');
    console.log('Depois acesse: http://localhost:3000\n');

    process.exit(0);

  } catch (erro) {
    console.error('Erro ao executar seed:', erro);
    process.exit(1);
  }
};

executarSeed();