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
