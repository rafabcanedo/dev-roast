import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Toggle } from "@/components/ui/toggle";

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion
}`;

const LEADERBOARD: {
  rank: number;
  score: number;
  title: string;
  lang: string;
  severity: "critical" | "warning" | "good";
}[] = [
  {
    rank: 1,
    score: 1.2,
    title:
      "eval(p.meet('enter cmd()')\ndocument.write(id['replace'])\n// Trust the AI ;)",
    lang: "typescript",
    severity: "critical",
  },
  {
    rank: 3,
    score: 1.0,
    title:
      "if (a == TRUE) { return 'yes'; }\nelse if (c == false) { return false; }\nelse { return false; }",
    lang: "javascript",
    severity: "critical",
  },
  {
    rank: 7,
    score: 2.1,
    title: "SELECT * FROM users WHERE 1=0\nTODO: add authentication",
    lang: "sql",
    severity: "warning",
  },
];

export default async function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-mono text-4xl font-bold leading-tight text-content">
          <span className="text-accent-green">$</span> paste your code.{" "}
          get roasted.
        </h1>
        <p className="font-mono text-sm text-muted">
          // Drop your code below and we&apos;ll rate it — Brutally honest as
          hell, sorry not sorry.
        </p>
      </div>

      {/* Code input */}
      <CodeBlock code={SAMPLE_CODE} lang="javascript" filename="main.js" />

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <Toggle label="roast mode" defaultChecked />
        <Button>PASTE_MY_CODE</Button>
      </div>

      {/* Stats */}
      <p className="mt-4 text-center font-mono text-xs text-muted">
        2,147 codes roasted &middot; 414 lines &middot; 2/23
      </p>

      {/* Leaderboard */}
      <section className="mt-16">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-mono text-sm text-muted">
            <span className="text-accent-green">#</span> sharer_leaderboard
          </h2>
          <span className="font-mono text-xs text-muted">1 ←$sol.it →</span>
        </div>
        <p className="mb-5 font-mono text-xs text-ghost">
          // the worst code of the internet, sorted by shame.
        </p>

        {/* Table header */}
        <div className="flex items-center gap-4 px-4 py-2 font-mono text-xs text-ghost">
          <span className="w-6">#</span>
          <span className="w-10">score</span>
          <span className="flex-1">task</span>
          <span className="w-24 text-right">lang</span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-px">
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-start gap-4 border border-border bg-surface px-4 py-3 font-mono text-xs"
            >
              <span className="w-6 shrink-0 text-muted">{entry.rank}</span>
              <span className="w-10 shrink-0 text-accent-amber">
                {entry.score.toFixed(1)}
              </span>
              <pre className="flex-1 whitespace-pre-wrap text-content">
                {entry.title}
              </pre>
              <Badge variant={entry.severity} className="shrink-0">
                {entry.lang}
              </Badge>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center font-mono text-xs text-muted">
          Showing 3 of 2,147 &middot; View full leaderboard →
        </p>
      </section>
    </div>
  );
}
