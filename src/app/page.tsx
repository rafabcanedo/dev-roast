import Link from "next/link";
import { HomeEditor } from "./home-editor";
import {
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";

const leaderboardEntries = [
  {
    rank: 1,
    score: 1.2,
    lines: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    language: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    lines: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    language: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    lines: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    language: "sql",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-3 pt-20 px-10">
        <h1 className="flex items-center gap-3 font-mono text-4xl font-bold">
          <span className="text-accent-green">$</span>
          <span className="text-content">paste your code. get roasted.</span>
        </h1>
        <p className="font-mono text-sm text-muted">
          {"// drop your code below and we'll rate it — brutally honest or full roast mode"}
        </p>
      </section>

      {/* Editor + Actions */}
      <section className="w-full max-w-5xl px-10 pt-8">
        <HomeEditor />
      </section>

      {/* Footer Stats */}
      <div className="flex items-center gap-6 justify-center pt-8">
        <span className="font-mono text-xs text-ghost">2,847 codes roasted</span>
        <span className="font-mono text-xs text-ghost">·</span>
        <span className="font-mono text-xs text-ghost">avg score: 4.2/10</span>
      </div>

      {/* Spacer */}
      <div className="h-15" />

      {/* Leaderboard Preview */}
      <section className="flex flex-col gap-6 w-full max-w-5xl px-10 pb-15">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-sm font-bold text-content">
              shame_leaderboard
            </span>
          </div>

          <Link
            href="/leaderboard"
            className="font-mono text-xs text-muted border border-border px-3 py-1.5 hover:bg-elevated transition-colors"
          >
            $ view_all {">>"}
          </Link>
        </div>

        {/* Subtitle */}
        <p className="font-mono text-[13px] text-ghost -mt-2">
          {"// the worst code on the internet, ranked by shame"}
        </p>

        {/* Leaderboard Table */}
        <div className="border border-border w-full">
          {/* Table Header */}
          <div className="flex items-center h-10 px-5 bg-surface border-b border-border">
            <span className="w-10 font-mono text-xs font-medium text-ghost">#</span>
            <span className="w-15 font-mono text-xs font-medium text-ghost">score</span>
            <span className="flex-1 font-mono text-xs font-medium text-ghost">code</span>
            <span className="w-25 font-mono text-xs font-medium text-ghost text-right">lang</span>
          </div>

          {/* Table Rows */}
          {leaderboardEntries.map((entry) => (
            <LeaderboardRowRoot key={entry.rank}>
              <LeaderboardRowRank>#{entry.rank}</LeaderboardRowRank>
              <LeaderboardRowScore value={entry.score} />
              <LeaderboardRowCode>{entry.lines.join(" · ")}</LeaderboardRowCode>
              <LeaderboardRowLanguage>{entry.language}</LeaderboardRowLanguage>
            </LeaderboardRowRoot>
          ))}
        </div>

        {/* Fade Hint */}
        <p className="font-mono text-xs text-ghost text-center">
          showing top 3 of 2,847 ·{" "}
          <Link
            href="/leaderboard"
            className="text-muted hover:text-content transition-colors"
          >
            view full leaderboard {">>"}
          </Link>
        </p>
      </section>
    </main>
  );
}
