# Drizzle ORM — Specification

> Spec de implementação do banco de dados para o DevRoast usando Drizzle ORM + PostgreSQL + Docker Compose.

## Contexto

O DevRoast é um analisador de qualidade de código que dá uma nota de 0 a 10. O usuário cola um trecho de código, opcionalmente ativa o "roast mode", e recebe:

- **Score** (0–10, decimal)
- **Verdict** (enum com 5 níveis baseados no score)
- **Roast quote** (frase sarcástica ou construtiva gerada por IA)
- **Analysis items** (lista de findings com severidade `critical`, `warning` ou `good`)
- **Suggested fix** (código melhorado gerado pela IA)

Submissões são **anônimas** — sem autenticação no MVP. Toda submissão entra automaticamente no **shame leaderboard**.

A IA será integrada via **Vercel AI SDK** (provider-agnóstico).

---

## Stack do banco

| Camada     | Tecnologia                  |
| ---------- | --------------------------- |
| ORM        | Drizzle ORM (`drizzle-orm`) |
| Migrations | Drizzle Kit (`drizzle-kit`) |
| Driver     | `pg` (node-postgres)        |
| Banco      | PostgreSQL 16               |
| Container  | Docker Compose              |

---

## Decisões de design

### Casing automático

Usamos `casing: "snake_case"` tanto no `drizzle.config.ts` quanto no client `drizzle()`. Isso permite que o schema use camelCase no TypeScript sem alias explícito — o Drizzle converte automaticamente para snake_case no SQL.

```typescript
// Schema: camelCase sem alias
lineCount: integer().notNull()
// SQL gerado: line_count integer NOT NULL
```

### Sem Drizzle relations

Não usamos `relations()` do Drizzle. Queries são feitas com `.select().from().leftJoin()` — mais explícitas e sem dependência da `db.query` API.

### Índices mínimos

Apenas um índice custom: `roasts_score_idx` para o `ORDER BY` do leaderboard. PKs já têm índice implícito. FK inline não justifica índice dedicado no volume esperado.

### Rate limiting via `ip_hash`

Para MVP, gravamos o hash SHA-256 do IP do cliente na tabela `roasts`. Isso permite queries de rate limiting sem guardar dados pessoais. Redis/Upstash pode substituir ou complementar em fases futuras.

---

## Enums

```typescript
export const verdictEnum = pgEnum("verdict", [
  "needs_serious_help", // score 0–2     — vermelho
  "rough_around_edges", // score 2.1–4   — âmbar
  "decent_code",        // score 4.1–6   — amarelo
  "solid_work",         // score 6.1–8   — verde claro
  "exceptional",        // score 8.1–10  — verde
])

export const severityEnum = pgEnum("severity", [
  "critical", // vermelho — problema grave
  "warning",  // âmbar   — pode melhorar
  "good",     // verde   — ponto positivo
])
```

> **Mapeamento de cores no design system:**
> - `critical` / `needs_serious_help` → `$accent-red`
> - `warning` / `rough_around_edges` / `decent_code` → `$accent-amber`
> - `good` / `solid_work` / `exceptional` → `$accent-green`

---

## Tabelas

### `roasts`

Tabela principal. Cada row é uma submissão de código analisada.

| Coluna          | Tipo                     | Descrição                                           |
| --------------- | ------------------------ | --------------------------------------------------- |
| `id`            | `uuid` PK default random | Identificador único do roast                        |
| `code`          | `text` NOT NULL          | Código fonte submetido pelo usuário                 |
| `language`      | `varchar(50)` NOT NULL   | Linguagem detectada ou informada (ex: `javascript`) |
| `line_count`    | `integer` NOT NULL       | Quantidade de linhas do código                      |
| `roast_mode`    | `boolean` default `true` | Se o usuário ativou o modo sarcasmo                 |
| `score`         | `real` NOT NULL          | Nota de 0 a 10 (ex: `3.5`)                         |
| `verdict`       | `verdict` NOT NULL       | Enum do veredito baseado no score                   |
| `roast_quote`   | `text`                   | Frase sarcástica/construtiva gerada pela IA         |
| `suggested_fix` | `text`                   | Código melhorado gerado pela IA                     |
| `ip_hash`       | `varchar(64)`            | SHA-256 do IP do cliente (rate limiting, sem PII)   |
| `created_at`    | `timestamptz` default now| Data de criação                                     |

```typescript
export const roasts = pgTable(
  "roasts",
  {
    id: uuid().defaultRandom().primaryKey(),
    code: text().notNull(),
    language: varchar({ length: 50 }).notNull(),
    lineCount: integer().notNull(),
    roastMode: boolean().default(true).notNull(),
    score: real().notNull(),
    verdict: verdictEnum().notNull(),
    roastQuote: text(),
    suggestedFix: text(),
    ipHash: varchar({ length: 64 }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("roasts_score_idx").on(table.score)],
)
```

### `analysis_items`

Findings da análise detalhada. Relaciona N:1 com `roasts`.

| Coluna        | Tipo                     | Descrição                                  |
| ------------- | ------------------------ | ------------------------------------------ |
| `id`          | `uuid` PK default random | Identificador único do item                |
| `roast_id`    | `uuid` FK → roasts.id    | Roast ao qual pertence (cascade delete)    |
| `severity`    | `severity` NOT NULL      | Nível de severidade (`critical/warning/good`) |
| `title`       | `varchar(200)` NOT NULL  | Título curto do finding                    |
| `description` | `text` NOT NULL          | Explicação detalhada                       |
| `order`       | `integer` NOT NULL       | Ordem de exibição (0-indexed)              |

```typescript
export const analysisItems = pgTable("analysis_items", {
  id: uuid().defaultRandom().primaryKey(),
  roastId: uuid()
    .references(() => roasts.id, { onDelete: "cascade" })
    .notNull(),
  severity: severityEnum().notNull(),
  title: varchar({ length: 200 }).notNull(),
  description: text().notNull(),
  order: integer().notNull(),
})
```

---

## Estrutura de arquivos

```
src/
  db/
    index.ts          # Conexão com o banco (drizzle client, casing: snake_case)
    schema.ts         # Enums, tabelas e índice
docker-compose.yml    # PostgreSQL 16 container
drizzle.config.ts     # Config do Drizzle Kit (casing: snake_case, dotenv)
drizzle/              # Migrations geradas — versionado no git
.env.local            # DATABASE_URL (gitignored)
```

---

## Arquivos de configuração

### `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    volumes:
      - devroast_pgdata:/var/lib/postgresql/data

volumes:
  devroast_pgdata:
```

### `.env.local`

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

### `drizzle.config.ts`

```typescript
import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local" })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: databaseUrl,
  },
})
```

### `src/db/index.ts`

```typescript
import { drizzle } from "drizzle-orm/node-postgres"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

export const db = drizzle(databaseUrl, {
  casing: "snake_case",
})
```

---

## Scripts npm

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Dependências

### Produção

```bash
pnpm add drizzle-orm pg
```

### Desenvolvimento

```bash
pnpm add -D drizzle-kit @types/pg dotenv
```

---

## Queries esperadas

### Leaderboard (shame ranking)

```typescript
import { asc } from "drizzle-orm"

const leaderboard = await db
  .select()
  .from(roasts)
  .orderBy(asc(roasts.score))
  .limit(20)
```

### Roast completo por ID (página de resultado)

```typescript
import { eq, asc } from "drizzle-orm"

const [roast] = await db
  .select()
  .from(roasts)
  .where(eq(roasts.id, roastId))

const items = await db
  .select()
  .from(analysisItems)
  .where(eq(analysisItems.roastId, roastId))
  .orderBy(asc(analysisItems.order))
```

### Stats globais (footer)

```typescript
import { avg, count } from "drizzle-orm"

const [stats] = await db
  .select({
    totalRoasts: count(),
    avgScore: avg(roasts.score),
  })
  .from(roasts)
```

### Rate limiting — contar submissões recentes por IP

```typescript
import { eq, gte, count } from "drizzle-orm"

const [result] = await db
  .select({ total: count() })
  .from(roasts)
  .where(
    and(
      eq(roasts.ipHash, ipHash),
      gte(roasts.createdAt, new Date(Date.now() - 60 * 60 * 1000)), // última hora
    ),
  )

const isRateLimited = result.total >= 10
```

### Inserir novo roast (após resposta da IA)

```typescript
await db.transaction(async (tx) => {
  const [roast] = await tx
    .insert(roasts)
    .values({
      code,
      language,
      lineCount,
      roastMode,
      score,
      verdict,
      roastQuote,
      suggestedFix,
      ipHash,
    })
    .returning()

  await tx.insert(analysisItems).values(
    items.map((item, index) => ({
      roastId: roast.id,
      severity: item.severity,
      title: item.title,
      description: item.description,
      order: index,
    })),
  )

  return roast
})
```

---

## Diagrama ER

```
┌──────────────────────────────┐
│            roasts             │
├──────────────────────────────┤
│ id             uuid PK        │
│ code           text           │
│ language       varchar(50)    │
│ line_count     integer        │
│ roast_mode     boolean        │
│ score          real       IDX │
│ verdict        verdict (enum) │
│ roast_quote    text           │
│ suggested_fix  text           │
│ ip_hash        varchar(64)    │
│ created_at     timestamptz    │
└───────────────┬──────────────┘
                │ 1
                │
                │ N
┌───────────────┴──────────────┐
│         analysis_items        │
├──────────────────────────────┤
│ id           uuid PK          │
│ roast_id     uuid FK          │
│ severity     severity (enum)  │
│ title        varchar(200)     │
│ description  text             │
│ order        integer          │
└──────────────────────────────┘
```

---

## TODOs de implementação

- [ ] Criar `docker-compose.yml` na raiz do projeto
- [ ] Instalar dependências (`drizzle-orm`, `pg`, `drizzle-kit`, `@types/pg`, `dotenv`)
- [ ] Criar `.env.local` com `DATABASE_URL` e adicionar ao `.gitignore`
- [ ] Criar `drizzle.config.ts` com `casing: "snake_case"` e dotenv
- [ ] Criar `src/db/schema.ts` com enums, tabelas e índice em `score`
- [ ] Criar `src/db/index.ts` com client Drizzle e `casing: "snake_case"`
- [ ] Adicionar scripts `db:generate`, `db:migrate`, `db:push`, `db:studio` ao `package.json`
- [ ] Adicionar `!drizzle` ao Biome `files.includes` para ignorar arquivos gerados
- [ ] Subir o container: `docker compose up -d`
- [ ] Gerar a primeira migration: `pnpm db:generate`
- [ ] Aplicar migration: `pnpm db:migrate`
- [ ] Validar com `pnpm db:studio` que as tabelas foram criadas corretamente
