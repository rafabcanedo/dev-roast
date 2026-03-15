import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const analysisCard = tv({
  base: ["flex flex-col gap-3 p-5", "border border-border"],
});

const analysisCardTitle = tv({
  base: "font-mono text-[13px] text-content",
});

const analysisCardDescription = tv({
  base: "text-xs leading-relaxed text-muted",
});

type AnalysisCardRootProps = ComponentProps<"div">;

function AnalysisCardRoot({ className, ...props }: AnalysisCardRootProps) {
  return <div className={analysisCard({ className })} {...props} />;
}

type AnalysisCardTitleProps = ComponentProps<"p">;

function AnalysisCardTitle({ className, ...props }: AnalysisCardTitleProps) {
  return <p className={analysisCardTitle({ className })} {...props} />;
}

type AnalysisCardDescriptionProps = ComponentProps<"p">;

function AnalysisCardDescription({
  className,
  ...props
}: AnalysisCardDescriptionProps) {
  return <p className={analysisCardDescription({ className })} {...props} />;
}

export {
  AnalysisCardRoot,
  AnalysisCardTitle,
  AnalysisCardDescription,
  analysisCard,
  type AnalysisCardRootProps,
  type AnalysisCardTitleProps,
  type AnalysisCardDescriptionProps,
};
