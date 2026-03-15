"use client";

import { tv } from "tailwind-variants";

const codeEditor = tv({
  base: "border border-border overflow-hidden flex flex-col",
});

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function CodeEditor({ value, onChange, className }: CodeEditorProps) {
  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 16);

  return (
    <div className={codeEditor({ className })}>
      {/* Window Header */}
      <div className="flex items-center gap-2 h-10 px-4 border-b border-border">
        <span className="size-3 rounded-full bg-dot-close" />
        <span className="size-3 rounded-full bg-dot-min" />
        <span className="size-3 rounded-full bg-dot-expand" />
      </div>

      {/* Code Area */}
      <div className="flex flex-1 bg-input">
        {/* Line Numbers */}
        <div className="flex flex-col items-end gap-0 py-4 px-3 w-12 border-r border-border bg-surface select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are index-based and never reorder
              key={i}
              className="font-mono text-xs leading-relaxed text-ghost"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="// paste your code here..."
          spellCheck={false}
          className="flex-1 py-4 px-4 bg-transparent font-mono text-xs leading-relaxed text-content placeholder:text-ghost outline-none resize-none min-h-80"
        />
      </div>
    </div>
  );
}

export { CodeEditor, type CodeEditorProps };
