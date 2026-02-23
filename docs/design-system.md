# PRD: XPACE ON (SaaS Multi-tenant para o Mercado da Dança)

## 1. Visão do Produto e Negócio
O XPACE ON é uma plataforma de streaming educacional (VOD) voltada para criadores de conteúdo de dança. 
- **Sociedade Base:** Jonathan, Alceu e Tayonara.
- **Identidade e Branding:** Assinada por Ton Novaes (Cyberpunk/Neon Urbano).
- **Modelo B2C (Autônomos):** Zero mensalidade, modelo Rev-Share (Split de 10% para a plataforma).
- **Modelo B2B (Escolas):** SaaS Híbrido (Mensalidade Fixa + Taxa transacional menor de 4.9%), com recurso de White-Label dinâmico.

## 2. Stack Tecnológica
- **Frontend Web:** Next.js (App Router) + Tailwind CSS + Framer Motion.
- **Frontend Mobile (Fase 2):** React Native (Expo) rodando como "Reader App" (sem checkout no app para evitar taxa da Apple/Google).
- **Backend & Database:** Supabase (PostgreSQL) com RLS para isolamento Multi-tenant.
- **Streaming de Vídeo:** Bunny.net (Bunny Stream com DRM e proteção de download).
- **Gateway de Pagamento:** Asaas (via API REST com recurso de Subcontas para Split Automático).

## 3. Identidade Visual (Design System Estrito)
- **Backgrounds:** Preto Absoluto (`#000000`) e Cinza (`#343434`).
- **Core Colors:** Roxo (`#6324b2`), Rosa (`#eb00bc`), Laranja (`#ff5200`).
- **Accent/Glow:** Gradiente `linear-gradient(90deg, #6324b2 0%, #eb00bc 50%, #ff5200 100%)`.
- **Tipografia:** `Chillax` (Headings), `Steelfish` (Números/Labels), `Poppins` (Texto corrido).
- **White-Label Escolas:** O sistema deve ler a `brand_color` e `logo_url` do banco de dados e sobrescrever a paleta neon apenas para os alunos daquela escola específica.

## 4. Funcionalidades Core
1. **Custom Video Player (React):**
   - *Mirror Mode:* Inversão horizontal do vídeo (`scaleX(-1)`).
   - *Speed Control:* Controle de reprodução (0.5x, 0.75x, 1x).
   - *Switch View:* Alternância de câmera (Frente/Costas) mantendo a sincronia de tempo.
2. **Dashboard do Professor (XPACE OS Integrado):**
   - Área de gestão de vendas, relatórios de engajamento, cadastro de aulas e visualização de repasses financeiros.
3. **Gamificação (XP e Leaderboard):**
   - Sistema de pontuação no Supabase (XP por aula concluída, sequência de dias).
4. **Perfil do Professor:**
   - Página pública estilo "Link na Bio" com as aulas à venda.

## 5. Regras de Negócio e Financeiras (Crítico)
- **Ticket Floor:** O sistema deve bloquear o cadastro de cursos com valor inferior a R$ 39,90 para proteger a margem transacional.
- **Trava de Saque (CDC):** O webhook do Asaas deve ser configurado para reter o saldo do professor parceiro na subconta por segurança contra chargebacks/reembolsos (garantia de 7 dias do consumidor).
- **Conta Única:** O aluno cria a conta na compra via Web. No mobile (lojas), haverá apenas tela de Login consumindo a mesma base do Supabase.

## 6. Missão Inicial para os Agentes de IA
**Agente de Arquitetura:** Inicie a estruturação do banco de dados relacional no Supabase. Crie as tabelas `users` (com RBAC: admin, professor, escola, aluno), `courses`, `lessons`, `progress`, e `transactions`.
