# CreatorPlanner AI

Planejador de conteúdo para criadores, com IA. Você informa nicho, objetivo, plataforma, frequência de posts, nível do público e tom de voz, e o app gera um **calendário de 30 dias** com título, hook de abertura, tópicos de roteiro, CTA e objetivo de cada post, além de ideias bônus.

> **Projeto de estudo.** Fiz este app para aprender e praticar. Ele **não foi feito para produção** e tem limitações conhecidas (veja abaixo). O código está aberto para quem quiser estudar, reaproveitar ou contribuir.

## Funcionalidades

- Landing page com apresentação, planos e FAQ
- Cadastro e login (senha com hash bcrypt)
- Geração do plano de conteúdo mensal via IA (DeepSeek)
- Projetos salvos por usuário: listar, buscar, abrir e excluir
- Visualização do calendário por post, com opção de copiar o plano

## Stack

| Camada   | Tecnologia                                   |
| -------- | -------------------------------------------- |
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS 4, lucide-react |
| Backend  | Funções serverless da Vercel (`/api`)        |
| Banco    | Postgres no [Neon](https://neon.tech)        |
| IA       | [DeepSeek](https://platform.deepseek.com) (`deepseek-chat`, API compatível com OpenAI) |

## Estrutura

```
├── api/                  # Funções serverless (Vercel)
│   ├── auth.ts           # Cadastro e login
│   ├── generate.ts       # Chamada à IA e validação do JSON gerado
│   ├── projects.ts       # CRUD de projetos salvos
│   ├── setup.ts          # Cria as tabelas no banco
│   └── setup-plans.ts    # Popula a tabela de planos
├── components/           # Telas: LandingPage, Auth, Dashboard, Generator
├── services/             # Clientes que chamam a API (dbService, geminiService)
├── App.tsx               # Navegação entre telas via estado
└── types.ts              # Tipos compartilhados
```

## Rodando localmente

**Pré-requisitos:** Node.js 18+, uma conta na Vercel (para a CLI), um banco Postgres no Neon e uma chave da API DeepSeek.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env.local` na raiz:
   ```env
   DATABASE_URL=postgres://usuario:senha@host/banco?sslmode=require
   API_KEY=sua-chave-deepseek
   ```
3. Rode com a Vercel CLI, que sobe o frontend e as funções de `/api` juntos:
   ```bash
   npx vercel dev
   ```

As tabelas são criadas automaticamente quando o app abre (o frontend chama `/api/setup`). Para popular os planos, faça um `POST` em `/api/setup-plans`.

> Com `npm run dev` só o frontend sobe. Nesse caso o app entra em "modo offline" e login e geração não funcionam.

## Limitações conhecidas

Como é um projeto de estudo, ficaram de fora coisas que um app real precisaria:

- **Sem autenticação nas rotas da API.** A "sessão" é só o usuário salvo no `localStorage`, e `/api/projects` confia no `userId` e no `id` recebidos, sem checar quem é o dono.
- **CORS aberto** (`*`) e `/api/setup` sem proteção.
- **Planos sem efeito.** A tabela de planos e assinaturas existe, mas não há cobrança (o Mercado Pago foi só planejado) nem limite de uso.
- **Preços diferentes** entre a landing page e o seed de `setup-plans.ts`.
- **Parsing do JSON da IA frágil.** Funciona, mas depende de um fallback.
- **Nomes que sobraram do Google AI Studio:** `geminiService.ts` usa DeepSeek e o `index.html` tem um `importmap` que não é usado.

Contribuições que resolvam algum desses pontos são bem-vindas.

## Licença

Uso livre para estudo. Se for publicar no GitHub, adicione um arquivo `LICENSE` (por exemplo, MIT) para deixar isso formal.
