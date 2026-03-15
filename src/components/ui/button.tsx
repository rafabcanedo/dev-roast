import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "inline-flex items-center justify-center gap-2",
    "font-mono font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer select-none",
  ],
  variants: {
    variant: {
      primary:
        "bg-accent-green text-page hover:bg-accent-green/80 focus-visible:ring-accent-green",
      secondary:
        "bg-elevated text-content hover:bg-elevated/80 focus-visible:ring-muted",
      ghost:
        "bg-transparent text-muted hover:bg-elevated hover:text-content focus-visible:ring-muted",
      destructive:
        "bg-accent-red text-content hover:bg-accent-red/80 focus-visible:ring-accent-red",
      outline:
        "border border-border bg-transparent text-muted hover:bg-elevated hover:text-content focus-visible:ring-muted",
    },
    size: {
      sm: "px-4 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} {...props} />
  );
}

export { Button, button };
export type { ButtonProps };
