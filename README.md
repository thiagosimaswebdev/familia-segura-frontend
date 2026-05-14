# 🏠 Família Segura — Frontend

Interface web do sistema de gerenciamento de abrigos e famílias afetadas por enchentes.  
Projeto fullstack desenvolvido no curso **Dev Fullstack da Vai Na Web**.

---

## 🎯 Sobre o projeto

O **Família Segura** conecta famílias desabrigadas a abrigos disponíveis durante situações de emergência. O sistema oferece um mapa interativo em tempo real, busca pública de familiares, dashboard de acompanhamento e painel administrativo.

A proposta central é simples: **qualquer pessoa consegue localizar um familiar abrigado** sem precisar criar conta ou fazer login.

---

## 🚀 Stack

| Tecnologia | Uso |
|---|---|
| Next.js 14 (App Router) | Framework React com roteamento |
| Tailwind CSS | Estilização responsiva |
| Leaflet + React Leaflet | Mapa interativo com marcadores |
| Axios | Comunicação com o backend |
| Context API | Gerenciamento de estado global |

---

## 📄 Páginas

| Rota | Descrição |
|---|---|
| `/` | Mapa interativo com todos os abrigos |
| `/abrigos` | Listagem com filtros por status e bairro |
| `/abrigos/:id` | Detalhe do abrigo com mini mapa e ocupação |
| `/familias` | Busca pública de familiares pelo nome |
| `/familias/cadastro` | Cadastro de família (requer conta ativa) |
| `/dashboard` | Visão geral em tempo real (requer login) |
| `/login` | Acesso ao sistema |
| `/cadastro` | Criar nova conta |

---

## ✨ Funcionalidades

- 🗺️ Mapa ao vivo com marcadores coloridos por status do abrigo
- 🔍 Busca pública de familiares — sem necessidade de login
- 📊 Dashboard com contadores e barras de ocupação
- 📱 Layout responsivo com menu hambúrguer para mobile
- 🔒 Área autenticada para cadastro e gestão de dados
- ⚙️ Painel administrativo para gerenciamento de usuários

---

## 📁 Estrutura

```
src/
├── app/              # Páginas (Next.js App Router)
├── components/       # Componentes reutilizáveis
│   ├── Navbar.jsx
│   ├── MapaAbrigos.jsx
│   ├── CardAbrigo.jsx
│   ├── CardDashboard.jsx
│   └── StatusBadge.jsx
├── context/          # Estado global de autenticação
└── services/         # Integração com a API
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js v18+
- Backend do projeto rodando (local ou em produção)

### Instalação

```bash
git clone https://github.com/thiagosimaswebdev/familia-segura-frontend.git
cd familia-segura-frontend
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para apontar para o ambiente de produção, substitua pelo endereço do seu backend hospedado.

### Iniciar

```bash
npm run dev
```

---

## 🌐 Deploy

- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Render](https://render.com)
- **Banco de dados:** [Supabase](https://supabase.com)

Configure a variável `NEXT_PUBLIC_API_URL` no painel da Vercel apontando para a URL do seu backend em produção.

---

## 📱 Compatibilidade mobile

O projeto foi ajustado para funcionar corretamente em dispositivos iOS, evitando o comportamento de zoom automático ao interagir com campos de formulário.

---

## 👨‍💻 Autor

**Thiago Simas**  
[![GitHub](https://img.shields.io/badge/GitHub-thiagosimaswebdev-181717?style=flat&logo=github)](https://github.com/thiagosimaswebdev)