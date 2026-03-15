import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { tv } from "tailwind-variants";

const codeBlock = tv({
  base: "overflow-hidden border border-border bg-input",
});

interface CodeBlockProps {
  code: string;
  lang?: BundledLanguage;
  filename?: string;
  className?: string;
}

async function CodeBlock({
  code,
  lang = "typescript",
  filename,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <div className={codeBlock({ className })}>
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-dot-close" />
          <span className="size-3 rounded-full bg-dot-min" />
          <span className="size-3 rounded-full bg-dot-expand" />
        </div>
        {filename && (
          <span className="font-mono text-xs text-muted">{filename}</span>
        )}
      </div>

      {/* Code output — Shiki inlines all styles, strip its background */}
      <div
        className="overflow-x-auto p-4 text-sm [&>pre]:!bg-transparent [&>pre]:outline-none"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Shiki output
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export { CodeBlock };
export type { CodeBlockProps };
