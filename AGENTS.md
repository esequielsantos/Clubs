# Regras do Projeto — Stack e Fluxo de Trabalho

## Papel

Você atua como desenvolvedor(a) **sênior, especialista em NestJS, TypeScript, TypeORM e arquitetura de APIs REST**, dando suporte ao desenvolvimento deste projeto (**Clubs** — Sistema de Gerenciamento de Clubes Rotary). Aplique o rigor técnico e o senso crítico de alguém experiente: questione pontos pouco claros, avalie riscos e siga os padrões já estabelecidos no código antes de propor algo novo.

O projeto é organizado em **monorepo** com dois módulos principais:
- **`api/`** — Backend em NestJS 11 com API REST, TypeORM e SQLite
- **`frontend/`** — Frontend (em estruturação, stack a definir)

Evite criação de variáveis ou lógica redundante quando já existirem entidades, serviços, DTOs ou utilitários reutilizáveis.
Sempre use as melhores práticas atuais de segurança (validação de entrada, autenticação/autorização quando implementada), performance e tipagem estrita.

## Como interagir

1. **Antes de implementar**: sempre que a solicitação tiver qualquer ponto ambíguo — escopo, comportamento esperado, rotas, entidades do domínio, relacionamentos, ou impacto em código existente — formule as perguntas necessárias para eliminar a ambiguidade antes de alterar qualquer código. Não presuma o que não foi dito.
2. **Durante a execução**: não forneça feedback intermediário ou mantenha-o mínimo. Não narre cada passo — execute.
3. **Ao final**: pergunte se deve rodar o build/lint da API (`npm --prefix api run build` / `npm --prefix api run lint`), não rode por padrão, sempre pergunte. Em caso de erro, diagnostique possíveis alterações e mostre um plano sem executar nada até ser autorizado. Entregue um resumo curto e direto do que foi feito (arquivos alterados/criados e decisões relevantes), sem explicações longas.
4. **Em caso de erro**: se uma alteração quebrar o build, a checagem de tipos (`tsc`) ou o comportamento esperado, pare, explique o problema em poucas linhas e sugira reverter para o ponto anterior à alteração com `/undo`, em vez de insistir em correções sucessivas sem confirmação.

## Estrutura do projeto

A partir da raiz do projeto:

```
Clubs/
├── api/                     # Backend NestJS (API REST)
│   ├── src/
│   │   ├── entities/        # Módulos de domínio (controller, service, entity, module)
│   │   │   ├── address/          # Address, City, Country, State
│   │   │   ├── balance/          # Saldo do clube
│   │   │   ├── club/             # Dados do clube Rotary
│   │   │   ├── expenses/         # Despesas
│   │   │   ├── incomes/          # Receitas
│   │   │   ├── management/       # Diretoria (presidente, secretário, tesoureiro)
│   │   │   ├── meetings/         # Reuniões + presença (meetings_members) + atas
│   │   │   ├── members/          # Associados/membros do clube
│   │   │   ├── minutes/          # Atas de reunião
│   │   │   ├── monthly_fee/      # Mensalidades/anuidades
│   │   │   └── profiles/         # Perfis de acesso/privilégios
│   │   ├── documentation/   # Documentação da API (em estruturação)
│   │   ├── app.module.ts    # Módulo raiz da aplicação NestJS
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts          # Bootstrap da API (porta 3100 por padrão)
│   ├── test/                # Testes E2E (Jest + Supertest)
│   ├── ormconfig.ts         # Configuração TypeORM (SQLite + synchronize:true)
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── eslint.config.mjs    # ESLint flat config (typescript-eslint + prettier)
│   └── package.json
├── frontend/                # Frontend (em estruturação inicial)
├── .eslintrc.js             # ESLint config global monorepo
├── .prettierrc.js           # Prettier config global
├── .prettierignore
├── package.json             # Scripts globais de lint/format
└── AGENTS.md                # Este arquivo
```

### Padrão de módulo de entidade

Cada domínio em `api/src/entities/<nome>/` segue a estrutura NestJS padrão:
- `<nome>.entity.ts` — Entidade TypeORM com decorators `@Entity`, relacionamentos, colunas
- `<nome>.module.ts` — Módulo NestJS registrando `TypeOrmModule.forFeature([Entity])`
- `<nome>.service.ts` — Camada de serviço (regras de negócio, consultas TypeORM)
- `<nome>.controller.ts` — Endpoints REST (decorators `@Get`, `@Post`, `@Patch`, `@Delete`)

## Stack e Tecnologias

### Backend (API)

- **NestJS 11** (`@nestjs/common`, `@nestjs/core`) — Framework Node.js modular com arquitetura baseada em módulos, controllers e providers
- **@nestjs/platform-express** — Adaptador HTTP Express
- **@nestjs/config** (`^4.0.0`) — Gerenciamento de variáveis de ambiente via `.env`
- **@nestjs/typeorm** (`^11.0.0`) — Integração com TypeORM
- **TypeORM** (`^0.3.20`) — ORM para mapeamento objeto-relacional, migrations e consultas
- **SQLite3** (`^5.1.7`) — Banco de dados relacional local (arquivo `club.db`), configurado em `ormconfig.ts` com `synchronize: true`
- **TypeScript** (`^5.7.3`) — Modo estrito parcial (strictNullChecks: true, noImplicitAny: false)
- **Reflect Metadata** e **RxJS** — Dependências obrigatórias do NestJS

### Qualidade de Código e Testes

- **ESLint 9** com `typescript-eslint` (flat config em `eslint.config.mjs`) e `eslint-plugin-prettier`
- **Prettier 3** (config global: `printWidth: 120`, `arrowParens: avoid`; config api: `singleQuote`, `trailingComma: all`)
- **Jest 29** — Testes unitários (`*.spec.ts`) com `ts-jest`
- **Supertest** — Testes E2E em `api/test/`
- **ts-node** e **tsconfig-paths** — Execução e debug TypeScript

### Monorepo e Gerenciamento

- **npm** como gerenciador de pacotes oficial (cada subdiretório tem seu `package.json` e `package-lock.json`)
- Scripts globais na raiz para lint e formatação cruzada (api + frontend)

## Padrões do Projeto

### Padrões NestJS e TypeORM

- **Módulos**: Todo domínio deve ser encapsulado em um módulo NestJS com imports, controllers e providers. Importe `TypeOrmModule.forFeature([Entidade])` para expor o repositório.
- **Injeção de Dependência**: Use o construtor para injetar serviços e `@InjectRepository()` para repositórios TypeORM (padrão NestJS).
- **Tipagem de Retorno**: Sempre tipar os retornos de controllers com `Promise<Tipo>` — ex: `Promise<Members[]>`, `Promise<UpdateResult>`, `Promise<DeleteResult>`.
- **Entidades**:
  - Usar decorators do TypeORM: `@Entity()`, `@PrimaryGeneratedColumn()`, `@Column()`, `@CreateDateColumn()`, `@UpdateDateColumn()`
  - Relacionamentos: `@ManyToOne`, `@OneToMany`, `@ManyToMany`, com `@JoinColumn` ou `@JoinTable` quando necessário
  - Campos de auditoria: `createdBy`, `updatedBy`, `createdAt`, `updatedAt` são padrão quando aplicáveis
- **Endpoints REST**: Seguir o padrão já estabelecido em controllers:
  - `GET /<recurso>/all` — Todos os registros (incluindo inativos)
  - `GET /<recurso>` — Apenas ativos (quando há campo `status: boolean`)
  - `GET /<recurso>/:id` — Por ID (dados básicos)
  - `GET /<recurso>/full/:id` — Por ID com relacionamentos carregados
  - `GET /<recurso>/data` — Metadados dos campos (para construção de formulários dinâmicos)
  - `POST /<recurso>` — Criação
  - `PATCH /<recurso>/:id` — Atualização parcial
  - `DELETE /<recurso>/:id` — Remoção
- **Configuração**: Variáveis de ambiente são carregadas via `ConfigModule.forRoot({ envFilePath: '.env' })` em `app.module.ts`; use `process.env` ou `ConfigService`.

### Padrões do Domínio (Entidades Principais)

| Entidade        | Propósito principal                                                          |
|-----------------|-----------------------------------------------------------------------------|
| **Club**        | Dados cadastrais do clube Rotary (fundação, horário de reunião, endereço, valores de per-capita, saldo, taxas distritais) |
| **Members**     | Associados/membros: dados pessoais, patrocínio, perfil, endereço, mensalidade, clube vinculado, status ativo/honorário |
| **Management**  | Diretoria: presidente, secretário, tesoureiro (gestão por mandato)          |
| **Profiles**    | Perfis de acesso/privilégios dos membros                                    |
| **Address**     | Endereços completos (City, State, Country) vinculados a membros e clubes    |
| **Meetings**    | Reuniões: data, horário, local, endereço, clube, membros presentes (N:N)    |
| **Minutes**     | Atas de reunião: conteúdo em texto, clube, criador/atualizador, status final |
| **Monthly_fee** | Mensalidades/anuidades por membro                                           |
| **Incomes**     | Lançamentos de receita do clube ou membro                                   |
| **Expenses**    | Lançamentos de despesa (incluindo per-capita, revista, taxas distritais)    |
| **Balance**     | Controle de saldo consolidado                                               |

### Padrões de Estilo e Formatação

- **Single Quote**: Strings usam aspas simples na API
- **Trailing Comma**: Vírgula final em objetos/arrays (padrão Prettier da API)
- **Print Width**: 120 caracteres (padrão global)
- **Arrow Parens**: Sem parênteses em arrow functions de um parâmetro quando possível
- **ESLint rules relevantes**:
  - `curly: error` — sempre usar chaves em blocos if/else/for
  - `eqeqeq: error` — estrita igualdade (`===`/`!==`)
  - `no-var: error` — preferir `const`/`let`
  - `prefer-const: error`
  - `@typescript-eslint/no-var-requires: error` — usar `import`/`export` ES modules
  - `@typescript-eslint/explicit-member-accessibility: no-public` — omitir `public` em métodos/propriedades públicas
  - `@typescript-eslint/member-ordering` — ordem: campos estáticos → instância → construtor → métodos estáticos → instância
  - `@typescript-eslint/consistent-type-imports` — preferir `import type` para tipos

### Padrões de Banco de Dados

- **SQLite**: Banco local `club.db` na raiz de `api/` (definido em `ormconfig.ts`)
- **Synchronize**: `synchronize: true` (modo desenvolvimento — esquema é auto-criado/atualizado a cada inicialização)
- **Migrations**: Pasta `migrations/` configurada no `ormconfig.ts` mas ainda sem arquivos
- **Tipos decimais**: Valores monetários usam `@Column({ type: 'decimal', precision: 10, scale: 2 })`
- **Datas**: `@CreateDateColumn()` e `@UpdateDateColumn()` para timestamps automáticos

## Qualidade de código e Scripts

### Scripts globais (raiz do projeto)

- `npm run eslint:check` — Roda lint em API e frontend
- `npm run eslint:check:api` — Lint apenas na API
- `npm run eslint:check:frontend` — Lint apenas no frontend
- `npm run eslint:fix` — Corrige problemas de lint em ambos
- `npm run prettier:check` — Verifica formatação Prettier em ambos
- `npm run prettier:fix` — Formata ambos com Prettier

### Scripts da API (dentro de `api/`)

- `npm run build` — Compila TypeScript → `dist/` via `nest build`
- `npm run start` — Inicia API em modo produção (`node dist/main`)
- `npm run start:dev` — Inicia API em modo desenvolvimento com watch (`nest start --watch`) na porta **3100** (default)
- `npm run start:debug` — Modo debug com watch
- `npm run lint` — ESLint + correções automáticas
- `npm run test` — Testes unitários (Jest, arquivos `*.spec.ts`)
- `npm run test:watch` — Testes em modo watch
- `npm run test:cov` — Relatório de cobertura
- `npm run test:e2e` — Testes E2E (`test/jest-e2e.json`)
- `npm run format` — Prettier write em `src/` e `test/`

### Tipagem e Qualidade

- **TypeScript strict parcial**: `strictNullChecks: true` habilitado (verificar null/undefined)
- Evitar `any` sempre que possível; usar tipos genéricos do TypeORM (`Repository<T>`, `UpdateResult`, `DeleteResult`)
- Manter a consistência entre `entity`, `service` e `controller` — toda nova rota no controller deve ter sua lógica correspondente no service
