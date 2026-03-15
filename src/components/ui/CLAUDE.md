# UI Component Patterns

Rules and conventions for all components inside `src/components/ui/`.

---

## Stack

- **tailwind-variants** (`tv`) — variant definition and class merging
- **tailwind-merge** — available as `twMerge` for use outside of `tv` context only
- **Tailwind CSS v4** — utility classes
- **@base_ui/react** — headless primitives for interactive components
- **shiki** — syntax highlighting for server-rendered code blocks

---

## Design Tokens (globals.css `@theme`)

| Token | Value | Usage |
|---|---|---|
| `--font-mono` | JetBrains Mono | `font-mono` |
| `--font-ibm` | IBM Plex Mono | `font-ibm` |
| `--color-page` | `#0a0a0a` | `bg-page` |
| `--color-surface` | `#0f0f0f` | `bg-surface` |
| `--color-elevated` | `#1a1a1a` | `bg-elevated` |
| `--color-input` | `#111111` | `bg-input` |
| `--color-border` | `#2a2a2a` | `border-border` |
| `--color-accent-green` | `#10b981` | `text-accent-green`, `bg-accent-green` |
| `--color-accent-amber` | `#f59e0b` | `text-accent-amber`, `bg-accent-amber` |
| `--color-accent-red` | `#ef4444` | `text-accent-red`, `bg-accent-red` |
| `--color-content` | `#fafafa` | `text-content` |
| `--color-muted` | `#6b7280` | `text-muted` |
| `--color-ghost` | `#4b5563` | `text-ghost` |

---

## Conventions

### Named exports only

Never use `default export` for components or utilities.

```tsx
// correct
export { Button, button };
export type { ButtonProps };

// wrong
export default Button;
```

---

### Extend native HTML element props

Always extend the native HTML element's props via `React.HTMLAttributes` (or the specific element type) so consumers can pass any native attribute without extra wiring.

```tsx
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;
```

For interactive components backed by Base UI, define a custom props type instead:

```tsx
type ToggleProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean, event: Event) => void;
  label?: string;
  className?: string;
};
```

---

### Use `tv()` for variants — no manual `twMerge`

Define all variants inside `tv()`. Pass `className` directly to the `tv()` call — `tailwind-variants` handles the merge internally. Do NOT wrap the result with `twMerge`.

```tsx
// correct
function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />;
}

// wrong — redundant, tv already merges
function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={twMerge(button({ variant, size }), className)} {...props} />;
}
```

---

### Export the `tv` recipe alongside the component

Exporting the recipe (e.g. `button`) allows consumers to compose variants into other components without re-importing the component itself.

```tsx
export { Button, button };
```

---

### Structure of a `tv()` recipe

```tsx
const component = tv({
  base: ["...shared classes"],
  variants: {
    variant: {
      primary: "...",
      secondary: "...",
    },
    size: {
      sm: "...",
      md: "...",
      lg: "...",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

---

### Compound variants

Use `compoundVariants` for combinations that require specific class overrides.

```tsx
const component = tv({
  compoundVariants: [
    {
      variant: "outline",
      size: "sm",
      className: "border-dashed",
    },
  ],
});
```

---

### Interactive components — use Base UI primitives

For components with behavior (toggles, dialogs, menus, checkboxes, etc.) always use
a Base UI primitive as the foundation. Import from `@base_ui/react/<Component>`:

```tsx
import * as Switch from "@base_ui/react/Switch";

// Switch.Root — controls state, emits data-[checked] attribute
// Switch.Thumb — the visual knob
```

Mark the file with `"use client"` since Base UI primitives require a browser context.

Style via the `data-[checked]:`, `data-[disabled]:`, `data-[open]:` Tailwind variants that
Base UI exposes on its roots.

---

### Server components — CodeBlock

`code-block.tsx` is an async React Server Component. It must never be imported
inside a `"use client"` file. Pass code as a plain string prop.

Shiki inlines all syntax colors as `style` attributes — override the generated `<pre>`
background with Tailwind:

```tsx
<div className="[&>pre]:!bg-transparent" dangerouslySetInnerHTML={{ __html: html }} />
```

Always add the Biome lint suppression comment for `dangerouslySetInnerHTML` when
the source is trusted (Shiki output):

```tsx
// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Shiki output
```

---

## File naming

| File | Component | Notes |
|---|---|---|
| `button.tsx` | `Button` | Client or server |
| `badge.tsx` | `Badge` | Server |
| `toggle.tsx` | `Toggle` | `"use client"` — Base UI Switch |
| `score-ring.tsx` | `ScoreRing` | Server, SVG |
| `diff-line.tsx` | `DiffLine` | Server |
| `code-block.tsx` | `CodeBlock` | Server, async, Shiki |
| `CLAUDE.md` | — | This file |

Keep one component per file. File name matches the exported component name in kebab-case.
