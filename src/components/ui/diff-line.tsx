import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
  base: "flex h-7 w-full items-center px-4 font-mono text-xs",
  variants: {
    type: {
      context: "bg-transparent",
      removed: "bg-diff-removed",
      added: "bg-diff-added",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const prefix = tv({
  base: "w-4 shrink-0 select-none",
  variants: {
    type: {
      context: "text-ghost",
      removed: "text-accent-red",
      added: "text-accent-green",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

type DiffLineProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof diffLine> & {
    linePrefix?: string;
  };

function DiffLine({
  type,
  linePrefix,
  className,
  children,
  ...props
}: DiffLineProps) {
  const defaultPrefix =
    type === "removed" ? "-" : type === "added" ? "+" : " ";

  return (
    <div className={diffLine({ type, className })} {...props}>
      <span className={prefix({ type })}>{linePrefix ?? defaultPrefix}</span>
      <span className="text-content">{children}</span>
    </div>
  );
}

export { DiffLine, diffLine };
export type { DiffLineProps };
