"use client";

import * as Switch from "@base_ui/react/Switch";
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const toggleRoot = tv({
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

const toggleLabel = tv({
  base: "font-mono text-sm text-accent-green",
});

type ToggleRootProps = ComponentProps<"div">;

function ToggleRoot({ className, ...props }: ToggleRootProps) {
  return <div className={toggleRoot({ className })} {...props} />;
}

type ToggleTriggerProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, event: Event) => void;
  disabled?: boolean;
  className?: string;
};

function ToggleTrigger({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
}: ToggleTriggerProps) {
  return (
    <Switch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={track({ className })}
    >
      <Switch.Thumb className={thumb()} />
    </Switch.Root>
  );
}

type ToggleLabelProps = ComponentProps<"span">;

function ToggleLabel({ className, ...props }: ToggleLabelProps) {
  return <span className={toggleLabel({ className })} {...props} />;
}

export {
  ToggleRoot,
  ToggleTrigger,
  ToggleLabel,
  type ToggleRootProps,
  type ToggleTriggerProps,
  type ToggleLabelProps,
};
