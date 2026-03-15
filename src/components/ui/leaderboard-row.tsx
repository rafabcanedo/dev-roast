import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const leaderboardRow = tv({
  base: [
    "flex items-center gap-6 px-5 py-4 w-full font-mono",
    "border-b border-border",
  ],
});

const leaderboardRowRank = tv({
  base: "w-10 text-[13px] text-ghost",
});

const leaderboardRowScore = tv({
  base: "w-15 text-[13px] font-bold",
  variants: {
    severity: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
    },
  },
  defaultVariants: {
    severity: "critical",
  },
});

const leaderboardRowCode = tv({
  base: "flex-1 text-xs text-muted truncate",
});

const leaderboardRowLanguage = tv({
  base: "w-25 text-xs text-ghost text-right",
});

type LeaderboardRowRootProps = ComponentProps<"div">;

function LeaderboardRowRoot({ className, ...props }: LeaderboardRowRootProps) {
  return <div className={leaderboardRow({ className })} {...props} />;
}

type LeaderboardRowRankProps = ComponentProps<"span">;

function LeaderboardRowRank({ className, ...props }: LeaderboardRowRankProps) {
  return <span className={leaderboardRowRank({ className })} {...props} />;
}

type LeaderboardRowScoreProps = ComponentProps<"span"> & {
  value: number;
};

function LeaderboardRowScore({
  value,
  className,
  ...props
}: LeaderboardRowScoreProps) {
  const severity =
    value <= 3 ? "critical" : value <= 6 ? "warning" : ("good" as const);

  return (
    <span className={leaderboardRowScore({ severity, className })} {...props}>
      {value.toFixed(1)}
    </span>
  );
}

type LeaderboardRowCodeProps = ComponentProps<"span">;

function LeaderboardRowCode({ className, ...props }: LeaderboardRowCodeProps) {
  return <span className={leaderboardRowCode({ className })} {...props} />;
}

type LeaderboardRowLanguageProps = ComponentProps<"span">;

function LeaderboardRowLanguage({
  className,
  ...props
}: LeaderboardRowLanguageProps) {
  return <span className={leaderboardRowLanguage({ className })} {...props} />;
}

export {
  LeaderboardRowRoot,
  LeaderboardRowRank,
  LeaderboardRowScore,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  leaderboardRow,
  type LeaderboardRowRootProps,
  type LeaderboardRowRankProps,
  type LeaderboardRowScoreProps,
  type LeaderboardRowCodeProps,
  type LeaderboardRowLanguageProps,
};
