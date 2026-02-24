# 🚀 XPACE ON

[![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React Native / Expo](https://img.shields.io/badge/React_Native-Expo-blue?style=for-the-badge&logo=react)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**O Holo-Deck Definitivo da Dança Hip-Hop e Freestyle.**
A XPACE ON não é apenas uma plataforma E-Learning; é uma experiência brutalista e cyberpunk gamificada, desenhada para engajar dançarinos e reter alunos através de uma engenharia avançada inspirada no ecossistema Web3 e Streaming.

---

## 💻 Tech Stack & Arquitetura

Este é um monorepo moderno contendo o universo Web e Mobile da XPACE ON.

- **Frontend Web**: Next.js 14 (App Router) + React 19 + TailwindCSS v4.
- **Frontend Mobile**: React Native (Expo SDK 52) + NativeWind (TailwindCSS) + React Navigation.
- **Backend & Database**: Supabase (PostgreSQL 15+) com Row Level Security (RLS) e Functions.
- **Autenticação**: Supabase Auth (Identity Linking, Google e Apple OAuth).
- **Pagamentos**: Gateway ASAAS com Webhooks Server-Side nativos.
- **Notificações**: Firebase Cloud Messaging / Servidor VAPID Web Push.
- **E-mails Transacionais**: SDK da Resend e templates em HTML.
- **Deploy**: Vercel (Web / Server-actions) e EAS Build (Mobile App).

---

## 🌌 Core Features (A Máquina de Vendas)

### 1. 🛡️ Segurança e Acesso
- **Oauth nativo:** Login imediato conectando conta Google ou Apple (Identity Link Database).
- **Identity Shield (Anti-Pirataria):** O middleware intercepta conexões simultâneas da mesma conta, mantendo apenas a última sessão ativa e derrubando pirataria de cursos (Sessão Única Compartilhada).
- **RLS Severo:** Alunos só têm tração em linhas do DB onde seus User IDs batem. Moderações e checkouts de matrículas ocorrem em Cloud Functions usando Key Bypass (`service_role`).

### 2. ⚡ Engajamento & Fóruns
- **Gamification:** Completar aulas preenche Barras de Energia e confere `XP`, rankeando usuários em The Board.
- **Mural em Tempo Real (Realtime):** Bate-papo da aula plugado ao *Supabase Realtime Canais*. Se o aluno A interage via Input ou *Likes*, o Frontend do aluno B reflete de imediato na tela, gerando retenção.
- **Push Notifications Ativo:** Web Push via Service Worker (Web) e Push API via Firebase (Mobile). Um gatilho silencioso no Banco manda Push Alerts direto na tela bloqueada do aluno quando novas Aulas caem na plataforma.

### 3. 💸 Retenção Automática e Pagamentos
- **Checkout Integrado ASAAS:** Geração instantânea de Códigos Pix no Frontend com processamento de Postback para Rota da API (Webhooks).
- **Carrinhos Abandonados Automáticos:** Rota da Vercel Edge detecta via Asaas (`PAYMENT_OVERDUE`) quando o usuário não pagou uma matrícula e aciona o Resend disparando e-mail transacional cyberpunk formatado, puxando o cliente de volta em Loop fechado.
- **Ads Server-Side (CAPI do Meta):** O Asaas Hook injeta o CAPI (`Conversions API`) pro Facebook de Servidor para Servidor sem bloqueio do iOS14. 

---

## 🛠️ Como Iniciar o Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js LTS (v20+)
- Conta no Supabase (Para sincronizar o banco Local/Remote)
- Expo Go instalado no Celular (caso teste o App).

### 1. Variáveis de Ambiente
Crie na raiz da pasta `web/` um arquivo `.env.local` contendo:
```env
NEXT_PUBLIC_SUPABASE_URL=seu-link-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-supabase
SUPABASE_SERVICE_ROLE_KEY=sua-chave-master-do-banco
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
ASAAS_API_KEY=sua-chave-asaas
RESEND_API_KEY=sua-chave-resend
NEXT_PUBLIC_VAPID_PUBLIC_KEY=seu-vapid-para-push
VAPID_PRIVATE_KEY=seu-vapid-privado-para-push
```

### 2. Rodando o Projeto WEB (Next.js)
```bash
cd web
npm install
npm run dev
# Acesse: http://localhost:3000
```

### 3. Rodando o Projeto MOBILE (Expo App)
```bash
cd mobile
npm install
npx expo start
# Escaneie o QR Code usando seu aplicativo do Expo!
```

---

## ⚖️ Licença e Propriedade

A arquitetura, a marca e a modelagem brutalista são propriedade intelectual de **Jonathan Ferreira (Prof. Ton Novaes) e XPACE ON**. Proibida a redistribuição comercial dos assets visuais contidos neste monorepo. Em caso de dúvidas sobre manutenção, leia o Manifesto `.agent` gerido pela Deepmind Antigravity.
