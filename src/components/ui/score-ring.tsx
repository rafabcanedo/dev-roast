import { tv } from "tailwind-variants";

const scoreRing = tv({
  base: "relative inline-flex items-center justify-center",
});

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function ScoreRing({
  score,
  size = 180,
  strokeWidth = 4,
  className,
}: ScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(Math.max(score / 10, 0), 1);
  const dashOffset = circumference * (1 - progress);
  const gradientId = `score-gradient-${size}`;

  return (
    <div
      className={scoreRing({ className })}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-green)" />
            <stop offset="100%" stopColor="var(--color-accent-amber)" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          className="fill-none stroke-border"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="font-mono text-5xl font-bold leading-none text-content">
          {score.toFixed(1)}
        </span>
        <span className="font-mono text-base leading-none text-ghost">/10</span>
      </div>
    </div>
  );
}

export { ScoreRing };
export type { ScoreRingProps };
