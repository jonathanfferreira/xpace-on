# ROADMAP DE DESENVOLVIMENTO: XPACE ON

## Visão Geral
Sprints curtos e com escopo travado para o desenvolvimento guiado por IA.

### Sprint 0: Fundação & Banco de Dados
**Foco:** Preparar o terreno para a IA não errar a arquitetura.

**Tarefas:**
- [ ] Criar o projeto no Supabase.
- [ ] Rodar os scripts SQL para criar as tabelas `tenants` (escolas/professores), `users`, `courses`, `lessons`, `progress` e `transactions`.
- [ ] Configurar as políticas de segurança (RLS) para que alunos de um professor não vejam os dados de outro.
- [ ] Criar a conta na Bunny.net (Vídeo) e no Asaas (Pagamentos) para gerar as chaves de API (API Keys).

### Sprint 1: Autenticação & Design System
**Foco:** Garantir o visual cyberpunk e o login seguro.

**Tarefas:**
- [ ] Inicializar o Next.js (Web) e o Expo (Mobile).
- [ ] Configurar o Tailwind CSS com a paleta exata (Preto, Cinza `#343434`, Gradiente Neon `#7000F0` a `#FF3300`).
- [ ] Importar as fontes (Outfit, Bebas Neue, Poppins).
- [ ] Criar as telas de Login e Cadastro (conectadas nativamente com a autenticação do Supabase).
- [ ] Criar a lógica de roteamento baseada em cargo (RBAC): Se for Professor, manda pro painel XPACE OS; se for aluno, manda pro app de consumo.

### Sprint 2: O Coração do Produto (O Video Player Customizado)
**Foco:** Bater de frente com a experiência do Steezy.

**Tarefas:**
- [ ] Criar o layout da "Sala de Aula" (área do vídeo, lista de módulos na lateral, comentários embaixo).
- [ ] Construir o Player React integrando os vídeos hospedados na Bunny.net.
- [ ] Implementar as funções vitais de dança:
  - Botão Espelhar (`scaleX(-1)`).
  - Botão Controle de Velocidade (`playbackRate`).
  - Lógica de Switch View (Trocar entre câmera frontal e traseira no mesmo timestamp).

### Sprint 3: A Máquina de Vendas (Checkout & Asaas)
**Foco:** Fazer o dinheiro entrar e ser dividido automaticamente.

**Tarefas (Apenas Web):**
- [ ] Desenvolver a página pública do perfil do professor (`xpace.on/nome`) com a vitrine de aulas.
- [ ] Criar a página de Checkout.
- [ ] Integrar a API do Asaas:
  - Criar subconta automática para o professor quando ele se cadastra.
  - Gerar o PIX/Cartão com regra de Split (Xpace retém %, Professor recebe o resto na subconta com trava de 7 dias).
- [ ] Criar o Webhook no Supabase: Quando o Asaas confirmar o pagamento, o banco de dados libera automaticamente o curso para o aluno.

### Sprint 4: XPACE OS (O Painel do Professor/Escola)
**Foco:** Dar controle total para os parceiros.

**Tarefas (Apenas Web):**
- [ ] Criar Dashboard Financeira: Gráficos de vendas, saldo Asaas a receber e alunos ativos.
- [ ] Criar a interface de Upload de Curso: Formulário para o professor adicionar título, preço (com a trava mínima de R$ 39,90), módulos e subir os vídeos.
- [ ] Implementar o "White-Label Light" para escolas (opção de trocar a cor primária e a logo do ambiente dos alunos deles).

### Sprint 5: Engajamento & Comunidade (Lock-in)
**Foco:** Fazer o aluno não querer sair do app.

**Tarefas (Web e Mobile):**
- [ ] Criar o algoritmo de Experiência (XP): Dar pontos no Supabase quando o aluno termina um vídeo.
- [ ] Construir o Leaderboard (Placar dos alunos com mais XP na semana).
- [ ] Implementar o mural da comunidade dentro de cada curso para envio de dúvidas e vídeos (desafios).

### Sprint 6: Preparação para as Lojas (Go Live)
**Foco:** Colocar o app na rua oficialmente.

**Tarefas:**
- [ ] Ajustes finais de UI e testes de bugs no Expo Go.
- [ ] Adicionar os Termos de Uso e Políticas de Privacidade (exigência da Apple e Google).
- [ ] Configurar o domínio próprio na Vercel (ex: app.xpaceon.com.br).
- [ ] Usar o EAS (Expo Application Services) para compilar a versão final do aplicativo e enviar para aprovação na Apple App Store e Google Play Store.
