# 🏆 Sistema de Gerenciamento ADC Taquaras

<div align="center">

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)

**Sistema web para gestão de equipe de futebol amador**

Projeto de Extensão Curricular - Desenvolvimento Web

</div>

---

## 📖 Sobre o Projeto

O **Sistema ADC Taquaras** é uma aplicação web desenvolvida para informatizar a gestão de uma equipe de futebol amador de Ibirama/SC. O sistema resolve problemas reais do clube, digitalizando processos que antes eram manuais.

### 🎯 Objetivo

Facilitar a organização de jogos, controle de inscrições, formação de equipes e agendamento de campos para a Associação Desportiva A.D.C Taquaras.

### 🌟 Impacto Social (Cunho Filantrópico)

- ✅ Auxilia organização **sem fins lucrativos** da comunidade
- ✅ Promove prática esportiva e vida saudável
- ✅ Facilita inclusão de novos jogadores

---

## ❗ Problema Identificado

A ADC Taquaras enfrentava diversos desafios na organização:

| Problema |
|----------|
| **Comunicação desorganizada** |
| **Sem controle de presença** |
| **Formação manual de times** |
| **Falta de registros** |

---

## ✅ Solução Implementada

Sistema web completo que centraliza toda a gestão em uma plataforma digital moderna:

### Funcionalidades Principais:

1. **👥 Gestão de Usuários**
   - Cadastro e login seguro (JWT)
   - Perfis: Jogador e Administrador
   - Senhas criptografadas (bcrypt)

2. **📝 Sistema de Inscrições**
   - Criação de dias de jogo
   - Inscrição online com 1 clique
   - Visualização de participantes
   - Validação automática de duplicatas

3. **⚽ Geração de Equipes**
   - Algoritmo automático e aleatório
   - Distribuição equilibrada de jogadores
   - Times com cores identificadoras
   - Geração em segundos

4. **📅 Agendamento de Campos**
   - Cadastro de campos esportivos
   - Reserva com data e horário
   - Validação automática de conflitos
   - Controle de disponibilidade

5. **📊 Dashboard**
   - Estatísticas em tempo real
   - Próximos jogos e agendamentos
   - Acesso rápido às funcionalidades

6. **⚙️ Painel Administrativo**
   - Gestão completa de usuários
   - CRUD de campos
   - Controle de dias de jogo

---

## 💻 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** - API REST
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas

### Frontend
- **React** 18 - Interface do usuário
- **TailwindCSS** - Estilização
- **React Router** - Navegação
- **Axios** - Requisições HTTP
- **Vite** - Build tool

### Ferramentas
- **Git/GitHub** - Versionamento
- **VS Code** - Editor
- **Postman** - Testes de API

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm 9+

### Passo a Passo

**1. Clone o repositório:**
```bash
git clone https://github.com/Zanchetti/taquaras-system
cd taquaras-system
```

**2. Configure o Backend:**
```bash
cd backend
npm install
node src/seed.js  # Popular banco com dados de teste
npm run dev       # Servidor em http://localhost:5000
```

**3. Configure o Frontend (em outro terminal):**
```bash
cd frontend
npm install
npm run dev       # App em http://localhost:3000
```

**4. Acesse o sistema:**
- URL: `http://localhost:3000`
- **Admin:** `admin@adctaquaras.com` / `admin123`
- **Jogador:** `joao@email.com` / `123456`

---

## 🎯 Como Usar

### Jogador:
1. Fazer cadastro/login
2. Ver próximos jogos em "Inscrições"
3. Clicar em "Inscrever-se"
4. Ver composição das equipes em "Equipes"
5. Agendar campos em "Agendamentos"

### Administrador:
1. Criar novos dias de jogo
2. Gerenciar campos (cadastrar, editar)
3. Gerar equipes automaticamente
4. Visualizar todos os usuários
5. Controlar status dos dias

<div align="center">