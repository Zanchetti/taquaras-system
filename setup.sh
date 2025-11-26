#!/bin/bash

# Script de Setup do Sistema ADC Taquaras
# Execute: bash setup.sh

echo "🏆 Sistema ADC Taquaras - Setup Automático"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"
echo ""

# Cria estrutura de pastas
echo "${BLUE}📁 Criando estrutura de pastas...${NC}"
mkdir -p backend/src/{config,middleware,routes,controllers}
mkdir -p frontend/src/{components,pages,services,context}

echo "✅ Estrutura de pastas criada"
echo ""

# Setup do Backend
echo "${BLUE}🔧 Configurando Backend...${NC}"
cd backend

# Cria package.json do backend
cat > package.json << 'EOF'
{
  "name": "adc-taquaras-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "better-sqlite3": "^9.2.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOF

# Cria .env
cat > .env << 'EOF'
PORT=5000
JWT_SECRET=adc_taquaras_secret_key_2024
JWT_EXPIRES_IN=7d
EOF

# Cria .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
database.sqlite
*.log
.DS_Store
EOF

echo "📦 Instalando dependências do backend..."
npm install

echo "✅ Backend configurado"
echo ""

# Setup do Frontend
cd ../
echo "${BLUE}⚛️  Configurando Frontend...${NC}"

# Verifica se existe frontend
if [ ! -d "frontend" ]; then
    echo "📦 Criando projeto Vite + React..."
    npm create vite@latest frontend -- --template react
fi

cd frontend

# Instala dependências adicionais
echo "📦 Instalando dependências do frontend..."
npm install
npm install react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Cria configuração do Tailwind
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adc-green': '#1a5f3f',
        'adc-light': '#2d8659',
      }
    },
  },
  plugins: [],
}
EOF

# Atualiza index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

# Cria .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
*.log
.DS_Store
EOF

echo "✅ Frontend configurado"
echo ""

cd ../

# Cria README principal
cat > README.md << 'EOF'
# 🏆 Sistema ADC Taquaras

Sistema de gerenciamento para equipe de futebol amador.

## 🚀 Como Executar

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## 📱 Acesso

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 👤 Primeiro Usuário Admin

Crie via Postman/Insomnia:

```
POST http://localhost:5000/api/auth/registro
{
  "nome": "Admin",
  "email": "admin@adctaquaras.com",
  "senha": "admin123",
  "tipo": "admin"
}
```

## 📚 Documentação Completa

Consulte o guia completo no artefato do projeto.
EOF

echo ""
echo "${GREEN}=========================================="
echo "✅ Setup concluído com sucesso!"
echo "==========================================${NC}"
echo ""
echo "${YELLOW}📋 Próximos passos:${NC}"
echo ""
echo "1️⃣  Copie os arquivos do código fornecido para as pastas correspondentes"
echo "2️⃣  Inicie o backend:"
echo "    ${BLUE}cd backend && npm run dev${NC}"
echo ""
echo "3️⃣  Em outro terminal, inicie o frontend:"
echo "    ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "4️⃣  Crie o primeiro usuário admin via Postman/Insomnia"
echo "5️⃣  Acesse http://localhost:3000 e faça login"
echo ""
echo "🎓 Boa sorte com seu projeto de extensão!"
echo ""