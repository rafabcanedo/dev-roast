"use client";

import {
  ToggleLabel,
  ToggleRoot,
  ToggleTrigger,
} from "@/components/ui/toggle";

function ToggleDemo() {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      <ToggleRoot>
        <ToggleTrigger defaultChecked />
        <ToggleLabel>roast mode</ToggleLabel>
      </ToggleRoot>
      <ToggleRoot>
        <ToggleTrigger />
        <ToggleLabel>roast mode</ToggleLabel>
      </ToggleRoot>
    </div>
  );
}

export { ToggleDemo };
