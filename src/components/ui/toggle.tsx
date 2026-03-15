"use client";

import * as Switch from "@base_ui/react/Switch";
import { tv } from "tailwind-variants";

const wrapper = tv({
  base: "inline-flex items-center gap-2.5",
});

const track = tv({
  base: [
    "relative inline-flex h-[22px] w-10 cursor-pointer rounded-full",
    "bg-elevated transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[checked]:bg-accent-green",
  ],
});

const thumb = tv({
  base: [
    "block size-4 translate-x-0.5 rounded-full bg-page",
    "transition-transform duration-150",
    "data-[checked]:translate-x-[22px]",
  ],
});

type ToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, event: Event) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

function Toggle({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  disabled,
  className,
}: ToggleProps) {
  return (
    <div className={wrapper({ className })}>
      <Switch.Root
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={track()}
      >
        <Switch.Thumb className={thumb()} />
      </Switch.Root>
      {label && (
        <span className="font-mono text-sm text-accent-green">{label}</span>
      )}
    </div>
  );
}

export { Toggle };
export type { ToggleProps };
