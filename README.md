# 🏠 Família Segura — Frontend

Interface web para o sistema de gerenciamento de abrigos e famílias afetadas por enchentes. Desenvolvida como projeto fullstack acadêmico no curso **Dev Fullstack da Vai Na Web**.

---

## 🎯 Sobre o projeto

O **Família Segura** é um sistema de gestão emergencial que conecta famílias desabrigadas a abrigos disponíveis durante situações de enchente. O frontend oferece uma experiência visual intuitiva com mapa interativo, dashboard em tempo real e formulários de cadastro.

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 14 (App Router) | Framework React com roteamento e SSR |
| Tailwind CSS | Estilização com classes utilitárias |
| Leaflet + React Leaflet | Mapa interativo com marcadores |
| Axios | Requisições HTTP para o backend |
| Context API (React) | Gerenciamento global de autenticação |

---

## 📄 Páginas

| Rota | Descrição | Auth |
|---|---|---|
| `/` | Mapa interativo com todos os abrigos | Não |
| `/abrigos` | Listagem de abrigos com filtros e paginação | Não |
| `/abrigos/:id` | Detalhe de um abrigo com mini mapa | Não |
| `/login` | Tela de login | Não |
| `/cadastro` | Criar nova conta de usuário | Não |
| `/dashboard` | Contadores em tempo real | Sim |
| `/familias` | Listagem de famílias cadastradas | Sim |
| `/familias/cadastro` | Formulário de cadastro de família | Sim |

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── layout.js              # Layout global com Navbar e AuthProvider
│   ├── page.js                # Mapa principal
│   ├── globals.css            # Estilos globais
│   ├── login/page.js          # Tela de login
│   ├── cadastro/page.js       # Criar conta
│   ├── dashboard/page.js      # Dashboard
│   ├── abrigos/
│   │   ├── page.js            # Listagem
│   │   └── [id]/page.js       # Detalhe
│   └── familias/
│       ├── page.js            # Listagem
│       └── cadastro/page.js   # Formulário
├── components/
│   ├── Navbar.jsx             # Navegação com menu hambúrguer
│   ├── MapaAbrigos.jsx        # Mapa Leaflet com marcadores coloridos
│   ├── CardAbrigo.jsx         # Card de abrigo na listagem
│   ├── CardDashboard.jsx      # Card de contador
│   └── StatusBadge.jsx        # Badge colorido de status
├── context/
│   └── AuthContext.jsx        # Contexto global de autenticação JWT
└── services/
    └── api.js                 # Instância Axios com interceptors
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js v18+
- Backend rodando (local ou em produção)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/thiagosimaswebdev/familia-segura-frontend.git
cd familia-segura-frontend

# Instale as dependências
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com:

```env
# URL do backend — use localhost para desenvolvimento local
NEXT_PUBLIC_API_URL=http://localhost:3000

# Para apontar para produção, use a URL do Render:
# NEXT_PUBLIC_API_URL=https://familia-segura-whp2.onrender.com
```

### Rodar o projeto

```bash
# Desenvolvimento
npm run dev
```

Acesse `http://localhost:3001` (ou a porta indicada no terminal)

---

## 🗺️ Como usar o sistema

### 1. Criar uma conta
Acesse `/cadastro` e crie sua conta de usuário.

### 2. Fazer login
Acesse `/login` com suas credenciais. O token JWT é salvo automaticamente.

### 3. Explorar o mapa
A página inicial mostra todos os abrigos no mapa:
- 🟢 **Verde** = Disponível (com vagas)
- 🔴 **Vermelho** = Lotado (sem vagas)
- ⚫ **Cinza** = Fechado

Use os filtros para visualizar apenas um status específico. Clique em um marcador para ver detalhes e acessar a página do abrigo.

### 4. Listar abrigos
Em `/abrigos` você encontra todos os abrigos com filtro por status e bairro, paginação e barra de ocupação visual.

### 5. Dashboard
Em `/dashboard` (requer login) você vê os contadores em tempo real:
- Total de abrigos, capacidade e vagas
- Total de famílias cadastradas e status

### 6. Cadastrar família
Em `/familias/cadastro` (requer login) você registra uma família afetada podendo vinculá-la diretamente a um abrigo disponível.

---

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Token)**:

1. Ao fazer login, o token é salvo no `localStorage`
2. O `api.js` adiciona o token automaticamente em todas as requisições via interceptor
3. Se o token expirar (8h), o sistema redireciona automaticamente para o login
4. O `AuthContext` gerencia o estado global do usuário logado

---

## 🌐 Deploy

- Frontend (online): https://seu-projeto.vercel.app
- Backend API: https://familia-segura-whp2.onrender.com
- Documentação Swagger: https://familia-segura-whp2.onrender.com/docs
- Banco de dados: Supabase (privado)

Configure a variável `NEXT_PUBLIC_API_URL` no painel da Vercel em **Settings → Environment Variables** apontando para a URL do backend no Render.

---

## 👨‍💻 Autor

**Thiago Simas**
[![GitHub](https://img.shields.io/badge/GitHub-thiagosimaswebdev-181717?style=flat&logo=github)](https://github.com/thiagosimaswebdev)
