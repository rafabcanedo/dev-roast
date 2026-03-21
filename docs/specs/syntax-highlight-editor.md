# Spec: Code Editor com Syntax Highlight

**Status:** Draft
**Data:** 2026-03-16
**Feature:** Editor interativo com syntax highlight automático na home page

---

## 1. Contexto

O editor atual (`code-editor.tsx`) é um `<textarea>` simples — sem highlight, sem detecção de linguagem. Para o devroast funcionar bem, o usuário precisa de feedback visual imediato ao colar o código: ver as cores corretas da sintaxe e saber qual linguagem foi detectada.

---

## 2. Pesquisa: Como ray.so resolve isso

O [ray.so](https://github.com/raycast/ray-so) usa uma arquitetura que serviu de principal referência:

| Camada | Biblioteca | Papel |
|---|---|---|
| Highlight | **Shiki** | Gera HTML com spans coloridos via TextMate grammars |
| Detecção | **highlight.js** | `hljs.highlightAuto()` identifica a linguagem automaticamente |
| Input | `<textarea>` sobreposto | O usuário digita em um textarea invisível, o highlight fica embaixo |
| Estado | Jotai atoms | Persiste linguagem detectada, linguagem selecionada, código |

### Técnica de sobreposição (overlay)

```
┌─────────────────────────────────┐
│ div (container, position:relative) │
│  ├── div (highlight output, aria-hidden) ← Shiki HTML renderizado │
│  └── textarea (transparente, z-index alto) ← input real do usuário │
└─────────────────────────────────┘
```

O textarea fica sobre o highlight com `background: transparent` e mesma fonte/tamanho. O usuário vê o highlight como se fosse o próprio editor.

---

## 3. Opções Avaliadas

### Opção A — Shiki + highlight.js + overlay (recomendada)
- **Shiki** para rendering HTML do highlight
- **highlight.js** só para auto-detecção de linguagem
- Textarea sobreposto para input
- **Prós:** Shiki já está no projeto (`code-block.tsx`), consistência visual total, leve, sem dependências pesadas
- **Contras:** Scroll sync entre textarea e div precisa de atenção; Shiki roda apenas no server sem config extra (precisa do modo browser ou WASM)

### Opção B — CodeMirror 6
- Editor completo, tudo em um: input + highlight + detecção via `@codemirror/language-data`
- **Prós:** Solução integrada, suporte nativo a tab handling, indentação, acessibilidade
- **Contras:** Bundle pesado (~500kb+), setup mais complexo, visual precisa de customização total para bater com o design system
- **Quando faz sentido:** Se a feature evoluir para um editor completo (autocomplete, linting)

### Opção C — Monaco Editor
- O editor do VS Code
- **Prós:** Experiência rica (autocomplete, linting, diff view)
- **Contras:** Muito pesado (~2MB+), overkill para o caso de uso (colar código para roasting)
- **Descartado**

### Opção D — Prism.js + overlay
- Similar à Opção A mas com Prism
- **Contras:** Shiki já está no projeto e tem qualidade de highlight superior; Prism não tem auto-detecção nativa
- **Descartado**

---

## 4. Decisão Recomendada

**Opção A: Shiki (browser mode) + highlight.js + overlay**

Justificativa:
- Shiki já é dependência do projeto (usado em `code-block.tsx`)
- highlight.js é leve e tem a melhor auto-detecção disponível (mesmo approach do ray.so)
- Mantém a stack simples sem adicionar editor frameworks pesados
- O design do editor atual já tem a estrutura visual certa (header com dots, line numbers, área de código)

**Shiki no browser:** usar `@shikijs/bundle/web` ou a API `createHighlighterCore` com WASM para rodar client-side sem SSR.

---

## 5. Spec de Implementação

### 5.1 Dependências novas

```bash
pnpm add highlight.js
# shiki já está instalado
```

> `highlight.js` será usado **somente** para `hljs.highlightAuto(code, languageSubset)`. Não para renderizar highlight.

### 5.2 Hook: `useLanguageDetection`

```ts
// src/hooks/use-language-detection.ts
function useLanguageDetection(code: string): DetectedLanguage
```

- Debounce de 300ms no código do input
- Chama `hljs.highlightAuto(code, SUPPORTED_LANGUAGES)`
- Retorna `{ language: string | null, confidence: number }`
- Só detecta se `code.trim().length > 20` (evita falsos positivos em snippets curtos)

### 5.3 Hook: `useShikiHighlighter`

```ts
// src/hooks/use-shiki-highlighter.ts
function useShikiHighlighter(code: string, language: string): string
```

- Inicializa `createHighlighterCore` uma vez (singleton) com WASM
- Carrega grammar da linguagem sob demanda (`loadLanguage`)
- Retorna HTML com spans coloridos
- Retorna string vazia (ou plaintext) enquanto carrega

### 5.4 Componente: `CodeEditor` (refatorado)

**Arquivo:** `src/components/code-editor.tsx`

Props que mudam:
```ts
type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;           // seleção manual (opcional)
  onLanguageChange?: (lang: string) => void;
  className?: string;
};
```

**Estrutura interna:**

```
CodeEditor
  ├── WindowHeader
  │    └── LanguageSelector (dropdown, mostra linguagem detectada ou selecionada)
  ├── CodeArea (position: relative)
  │    ├── LineNumbers (sincronizado com scroll)
  │    ├── HighlightLayer (div, aria-hidden, Shiki HTML)
  │    └── InputLayer (textarea transparente, z-index acima)
```

**Tab handling:** `onKeyDown` no textarea — Tab insere 2 espaços, Shift+Tab dedenta.

**Scroll sync:** `onScroll` no textarea sincroniza `scrollTop` e `scrollLeft` da div de highlight.

### 5.5 Componente: `LanguageSelector`

**Arquivo:** `src/components/ui/language-selector.tsx`

- Exibido no header do editor (onde ficam os dots do window chrome)
- Estado padrão: mostra a linguagem detectada com badge `auto`
- Ao clicar: abre dropdown com lista de linguagens suportadas + opção "Auto-detect"
- Quando o usuário seleciona manualmente: remove o badge `auto`, mostra a linguagem selecionada
- Ao limpar o código ou deletar tudo: volta para detecção automática

```
[ ● ● ● ]  [javascript · auto ▾]   ← header do editor
```

### 5.6 Linguagens Suportadas (MVP)

Para o MVP, suportar as linguagens mais comuns para o caso de uso (code review/roasting):

`javascript`, `typescript`, `tsx`, `jsx`, `python`, `rust`, `go`, `java`, `c`, `cpp`, `csharp`, `php`, `ruby`, `swift`, `kotlin`, `html`, `css`, `sql`, `bash`, `json`, `yaml`, `markdown`

### 5.7 Integração na `HomeEditor`

```tsx
// home-editor.tsx
const [language, setLanguage] = useState<string | undefined>(undefined);
// language = undefined → auto-detect
// language = "javascript" → manual

<CodeEditor
  value={code}
  onChange={setCode}
  language={language}
  onLanguageChange={setLanguage}
/>
```

A linguagem detectada/selecionada será passada junto com o código para a API de roasting quando essa for implementada.

---

## 6. Comportamento Esperado

| Cenário | Comportamento |
|---|---|
| Editor vazio | Sem highlight, placeholder visível, sem linguagem exibida |
| Usuário começa a digitar / cola código | Após 300ms, detecção roda; highlight aplica quando linguagem identificada |
| Linguagem não reconhecida | Header mostra `plain text`, sem highlight colorido |
| Usuário seleciona linguagem manualmente | Badge `auto` some, linguagem fixada, highlight roda com a linguagem forçada |
| Usuário volta para auto-detect | Badge `auto` volta, detecção roda no código atual |
| Código colado em linguagem diferente da selecionada | Sem re-detecção automática (usuário está no controle) |

---

## 7. TODOs

- [ ] **Pesquisa técnica** — validar que `@shikijs/bundle/web` ou `createHighlighterCore` + WASM roda bem no Next.js 14+ App Router client component sem SSR issues
- [ ] **Bundle analysis** — medir impacto no bundle: highlight.js (subset) + Shiki WASM
- [ ] **Scroll sync** — prototipar e validar que o sync entre textarea e highlight div é fluido (sem flickering)
- [ ] **Design** — alinhar visual do `LanguageSelector` no Pencil antes de implementar
- [ ] **Implementação** — `useLanguageDetection` hook
- [ ] **Implementação** — `useShikiHighlighter` hook
- [ ] **Implementação** — refatorar `CodeEditor` com overlay
- [ ] **Implementação** — `LanguageSelector` component
- [ ] **Implementação** — integrar na `HomeEditor`

---

## 8. Decisões Alinhadas

| # | Pergunta | Decisão |
|---|---|---|
| 1 | Tab size | **2 espaços** |
| 2 | Onde fica o LanguageSelector? | **Header do editor** (ao lado dos dots) |
| 3 | Loading state do highlight | **Spinner no badge** de linguagem |
| 4 | highlight.js bundle | **`common`** (35 langs) — manter leve |
| 5 | Prettier/formatação | **Fase 2** — não essencial para o roasting |
| 6 | Tema | **Somente dark** por enquanto |

