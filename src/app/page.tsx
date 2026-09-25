"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Gauge,
  GitPullRequest,
  Search,
  BarChart3,
  Eye,
  Zap,
  RotateCcw,
  TrendingUp,
  Shield,
  Check,
  X,
  ChevronRight,
  Github,
  ExternalLink,
  AlertTriangle,
  Activity,
  Timer,
  Bug,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook                                                */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px" }
    );

    const children = el.querySelectorAll(".reveal");
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  const { data: session, status } = useSession();
  const wrapperRef = useReveal();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div ref={wrapperRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{revealStyles}</style>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Gauge className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Dev<span className="text-primary">Pulse</span> AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/TimurRakhmatullin86/devpulse-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm hidden sm:flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <button
              onClick={() => signIn("github")}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6 border border-primary/20">
            <Activity className="w-3 h-3" />
            Open source &middot; MIT License
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Is Your AI Investment
            <br />
            <span className="text-primary">Paying Off?</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            DevPulse AI measures whether Copilot, Cursor, and Claude Code deliver ROI
            — or cost you in rework.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => signIn("github")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
            >
              <GitPullRequest className="w-4 h-4" />
              Try Demo
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/TimurRakhmatullin86/devpulse-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors w-full sm:w-auto justify-center border border-border"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3.5 h-3.5 opacity-50" />
            </a>
          </div>

          {/* Mini dashboard illustration */}
          <div className="mt-16 max-w-3xl mx-auto">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              The problem
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight">
              $24K&ndash;120K/year on AI coding tools.
              <br className="hidden sm:block" />
              <span className="text-muted-foreground"> What&rsquo;s the actual return?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <PainCard
              icon={<Eye className="w-5 h-5" />}
              title="No visibility"
              text="You don't know which teams actually use AI tools — or how much."
            />
            <PainCard
              icon={<Zap className="w-5 h-5" />}
              title="Speed hides quality"
              text="AI PRs merge 2x faster. But 2 weeks later — more rework, more incidents."
            />
            <PainCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Can't justify the spend"
              text="CFO asks 'Is this worth it?' — and no one can answer with data."
            />
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-card/50 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps to honest ROI
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <StepCard
              step="1"
              icon={<Github className="w-6 h-6" />}
              title="Connect your GitHub repos"
              text="Sign in with GitHub. Select repos. DevPulse installs a webhook — nothing to configure."
            />
            <StepCard
              step="2"
              icon={<Search className="w-6 h-6" />}
              title="We detect AI-assisted PRs"
              text="Co-Authored-By headers, commit patterns, AI config files. No guesswork — marker-based detection."
            />
            <StepCard
              step="3"
              icon={<BarChart3 className="w-6 h-6" />}
              title="See the honest dashboard"
              text="Speed gains, quality costs, net productivity score. One number that tells you if AI is worth it."
            />
          </div>
        </div>
      </section>

      {/* ── Metrics ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              Metrics that matter
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight">
              Beyond velocity
            </h2>
            <p className="reveal mt-4 text-muted-foreground max-w-xl mx-auto">
              Traditional metrics show speed. DevPulse shows speed <em>and</em> the hidden cost.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<Activity className="w-5 h-5 text-primary" />}
              label="AI Usage Rate"
              value="62%"
              description="% of PRs with AI markers"
            />
            <MetricCard
              icon={<Timer className="w-5 h-5 text-emerald-500" />}
              label="Speed Multiplier"
              value="2.1x"
              description="AI PRs merge faster"
            />
            <MetricCard
              icon={<RotateCcw className="w-5 h-5 text-amber-500" />}
              label="Rework Rate"
              value="18%"
              description="Fix PRs within 14 days"
            />
            <MetricCard
              icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
              label="Net Productivity"
              value="+34%"
              description="Speed gain minus quality cost"
            />
          </div>

          <div className="reveal mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MiniMetric label="Cycle Time" desc="Hours from open to merge, AI vs non-AI" />
            <MiniMetric label="Bug Rate" desc="Bug issues per 100 PRs" />
            <MiniMetric label="Code Churn" desc="Lines changed in same file within 14 days" />
          </div>
        </div>
      </section>

      {/* ── Comparison ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-card/50 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              Why DevPulse AI
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight">
              Open source alternative to
              <br />
              <span className="text-muted-foreground">$49/manager/month tools</span>
            </h2>
          </div>

          <div className="reveal overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                  <th className="text-center py-3 px-4">
                    <span className="text-primary font-semibold">DevPulse AI</span>
                  </th>
                  <th className="text-center py-3 px-4 text-muted-foreground">Exceeds AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <CompRow label="Price" ours="Free" theirs="$49/mgr/mo" />
                <CompRow label="Hosting" ours="Self-hosted" theirs="Cloud only" />
                <CompRow label="License" ours="MIT" theirs="Proprietary" />
                <CompRow label="AI detection" ours={true} theirs={true} />
                <CompRow label="Rework tracking" ours={true} theirs={true} />
                <CompRow label="ROI calculator" ours={true} theirs={false} />
                <CompRow label="Per-developer breakdown" ours={true} theirs={true} />
                <CompRow label="Source code access" ours={true} theirs={false} />
                <CompRow label="Custom detection rules" ours={true} theirs={false} />
                <CompRow label="Data stays on your infra" ours={true} theirs={false} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Detection ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              Detection engine
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight">
              How we detect AI-assisted code
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <DetectionCard
              level="1"
              confidence="High"
              label="Co-Authored-By header"
              desc="Git trailer containing copilot, claude, cursor, or ai"
              color="text-emerald-500"
              bg="bg-emerald-500/10"
            />
            <DetectionCard
              level="2"
              confidence="High"
              label="Commit message patterns"
              desc='"Generated by", "Auto-generated", [ai] tag'
              color="text-emerald-500"
              bg="bg-emerald-500/10"
            />
            <DetectionCard
              level="3"
              confidence="Medium"
              label="PR body markers"
              desc='"Generated with Claude/Copilot/Cursor" in description'
              color="text-amber-500"
              bg="bg-amber-500/10"
            />
            <DetectionCard
              level="4"
              confidence="Low"
              label="AI config files"
              desc=".cursor/, CLAUDE.md, .copilot in repository"
              color="text-orange-500"
              bg="bg-orange-500/10"
            />
          </div>

          <div className="reveal mt-6 bg-card border border-border rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Honest disclosure: </span>
              DevPulse uses marker-based detection. If a developer removes the
              Co-Authored-By header or AI markers before committing, the usage is
              invisible. We don&rsquo;t use code-style ML classifiers — accuracy matters
              more than coverage.
            </p>
          </div>
        </div>
      </section>

      {/* ── Dashboard pages ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-card/50 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="reveal text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              7 dashboard views
            </p>
            <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight">
              From executive summary to repo-level detail
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PageCard icon={<Gauge />} title="Executive Summary" desc='One number: "AI = +X% for your team"' />
            <PageCard icon={<BarChart3 />} title="Speed vs Quality" desc="Cycle time and rework, AI vs non-AI" />
            <PageCard icon={<GitPullRequest />} title="Per-Developer" desc="Who benefits most? Who needs help?" />
            <PageCard icon={<Shield />} title="Per-Repository" desc="Same breakdown by repository" />
            <PageCard icon={<TrendingUp />} title="Trends" desc="Weekly charts over time" />
            <PageCard icon={<Activity />} title="ROI Calculator" desc="Input costs, get dollar ROI" />
          </div>
        </div>
      </section>

      {/* ── Tech stack ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="reveal text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Tech stack
          </p>
          <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight mb-10">
            Built on proven foundations
          </h2>

          <div className="reveal flex flex-wrap justify-center gap-3">
            {[
              "Next.js 14",
              "TypeScript",
              "Tailwind CSS",
              "PostgreSQL",
              "Prisma ORM",
              "NextAuth.js",
              "Recharts",
              "GitHub Webhooks",
              "Docker",
            ].map((tech) => (
              <span
                key={tech}
                className="bg-card border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-card/50 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="reveal text-3xl sm:text-4xl font-bold tracking-tight">
            Stop guessing.
            <br />
            <span className="text-primary">Start measuring.</span>
          </h2>
          <p className="reveal mt-4 text-muted-foreground">
            Connect your GitHub repos. See your AI ROI in minutes.
          </p>
          <div className="reveal mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => signIn("github")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
            >
              <GitPullRequest className="w-4 h-4" />
              Try Demo
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/TimurRakhmatullin86/devpulse-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors w-full sm:w-auto justify-center border border-border"
            >
              <Github className="w-4 h-4" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="py-10 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Gauge className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">
              Dev<span className="text-primary">Pulse</span> AI
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a
              href="https://github.com/TimurRakhmatullin86/devpulse-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://dev.to/timurrakhmatullin/devpulse-ai-honest-roi-analytics-for-ai-coding-tools-3j8a"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              dev.to
            </a>
            <span>MIT License</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://github.com/TimurRakhmatullin86"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              Timur Rakhmatullin
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================== */
/*  Subcomponents                                                     */
/* ================================================================== */

function PainCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="reveal bg-card border border-border rounded-lg p-6">
      <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  text,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="reveal text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 relative">
        {icon}
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {step}
        </span>
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="reveal bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold font-mono tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function MiniMetric({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="reveal bg-card border border-border rounded-lg p-4 flex items-center gap-3">
      <Bug className="w-4 h-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function CompRow({
  label,
  ours,
  theirs,
}: {
  label: string;
  ours: string | boolean;
  theirs: string | boolean;
}) {
  return (
    <tr>
      <td className="py-3 px-4 text-muted-foreground">{label}</td>
      <td className="py-3 px-4 text-center">
        {typeof ours === "boolean" ? (
          ours ? (
            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
          ) : (
            <X className="w-4 h-4 text-destructive mx-auto" />
          )
        ) : (
          <span className="text-foreground font-medium">{ours}</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {typeof theirs === "boolean" ? (
          theirs ? (
            <Check className="w-4 h-4 text-emerald-500 mx-auto" />
          ) : (
            <X className="w-4 h-4 text-destructive mx-auto" />
          )
        ) : (
          <span className="text-muted-foreground">{theirs}</span>
        )}
      </td>
    </tr>
  );
}

function DetectionCard({
  level,
  confidence,
  label,
  desc,
  color,
  bg,
}: {
  level: string;
  confidence: string;
  label: string;
  desc: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="reveal bg-card border border-border rounded-lg p-5 flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}
      >
        <span className={`text-sm font-bold ${color}`}>L{level}</span>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm">{label}</h3>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${bg} ${color}`}
          >
            {confidence}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function PageCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="reveal bg-card border border-border rounded-lg p-5 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-0.5">{title}</h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

/* ── Dashboard mockup (pure CSS) ─────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">
          devpulse-ai / Executive Summary
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* ROI Score */}
        <div className="text-center py-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Net Productivity Score
          </p>
          <p className="text-5xl font-bold font-mono text-emerald-500">+34%</p>
          <p className="text-xs text-muted-foreground mt-1">
            AI is a net positive for this team
          </p>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MockStat label="AI Usage" value="62%" />
          <MockStat label="Speed" value="2.1x" />
          <MockStat label="Rework" value="18%" />
          <MockStat label="Cycle Time" value="4.2h" />
        </div>

        {/* Chart area */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-4 h-28 flex items-end gap-1.5 justify-center">
            {[40, 55, 35, 65, 50, 70, 60, 75, 80, 68, 85, 90].map((h, i) => (
              <div
                key={i}
                className="w-3 rounded-sm bg-primary/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="bg-muted/30 rounded-lg p-4 h-28 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-20 h-20">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                strokeDasharray="314"
                strokeDashoffset="120"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text
                x="60"
                y="65"
                textAnchor="middle"
                className="fill-foreground text-lg font-bold"
                style={{ fontSize: "22px" }}
              >
                62%
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 text-center">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-lg font-bold font-mono">{value}</p>
    </div>
  );
}

/* ── Scroll-reveal CSS ───────────────────────────────────────────── */
const revealStyles = `
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal:nth-child(2) { transition-delay: 0.1s; }
  .reveal:nth-child(3) { transition-delay: 0.2s; }
  .reveal:nth-child(4) { transition-delay: 0.3s; }
`;
