# Reddit Launch Posts — DevPulse AI

---

## r/programming

**Title:** DevPulse AI: open-source dashboard that measures whether AI coding tools deliver ROI or cost you in rework

My team spends $100/dev/month on Copilot and Cursor. 50 devs = $60K/year. Our CFO asked: "What's the return?" I couldn't answer. Nobody could.

I looked for tools — Exceeds AI charges $49/manager/month and raised $4.6M. Jellyfish, LinearB, GetDX measure engineering velocity but can't tell you which PRs used AI. GitHub's Copilot Metrics Viewer only works for Copilot.

So I built DevPulse AI. It connects to GitHub, detects AI-assisted PRs, and computes:
- **AI Usage Rate** — % of PRs using Copilot/Cursor/Claude Code
- **Speed Multiplier** — cycle time ratio (AI vs non-AI)
- **Rework Rate** — fix PRs within 14 days
- **Bug Rate** — bugs within 14 days of merge
- **Net Productivity Score** — speed gain minus quality cost

**How it detects AI:** marker-based, not AST. Looks for Co-Authored-By headers, commit message patterns, PR body markers, AI config files (.cursor/, CLAUDE.md). There's an experimental heuristic for large-fast PRs. I'll be honest: if someone removes the Co-Authored-By header, we can't see it.

The demo data tells an interesting story: AI PRs merge 2x faster but have 12-15% rework rate vs 7-9% for non-AI. Net positive, but not as dramatic as vendors claim.

Next.js 14 + PostgreSQL + Prisma. Docker Compose or Vercel deploy. MIT license.

https://github.com/TimurRakhmatullin86/devpulse-ai

---

## r/ExperiencedDevs

**Title:** Built an open-source tool to measure if AI coding tools actually help your team — real data is more nuanced than vendors claim

This might be controversial, but the more I measured AI coding tool impact, the more I found the picture is mixed.

I built DevPulse AI — it connects to GitHub repos, identifies which PRs used AI (Copilot, Cursor, Claude Code), and measures both speed AND quality.

From our demo dataset (based on real-world patterns):
- AI PRs merge in ~4-5 hours vs ~8-10 hours (genuine speedup)
- But rework rate is 12-15% for AI PRs vs 7-9% for non-AI
- AI PRs get more review comments
- The developer who uses 0% AI has the lowest rework rate
- Net productivity: positive (+12-17%), but nowhere near the "10x" vendors claim

The tool gives you one number: Net Productivity Score = speed gain - quality cost. Some teams will see -5%, some +25%. The point is to measure, not assume.

AI detection is marker-based (Co-Authored-By headers, commit patterns, PR body markers). Not perfect — no AST analysis. I'd rather under-count than over-count.

Self-hosted, open-source, MIT. The commercial equivalent (Exceeds AI) charges $49/manager/month.

Has anyone else tried to quantify this? What metrics are you tracking?

https://github.com/TimurRakhmatullin86/devpulse-ai

---

## r/devops

**Title:** Open-source dashboard for measuring AI coding tool ROI — connects to GitHub, shows if your $100/dev/month AI spend is worth it

Built an open-source alternative to Exceeds AI ($49/manager/month, $4.6M raised).

**What it does:** Connects to GitHub via GitHub App, detects AI-assisted PRs, shows executive dashboard with:
- AI Usage Rate across the org
- Cycle Time comparison (AI vs non-AI PRs)
- Rework Rate (AI PRs that needed fixes within 14 days)
- Per-developer and per-repo breakdown
- 12-week trends
- ROI Calculator (input license costs + salaries, get dollar impact)

**Deploy:** Docker Compose or Vercel. PostgreSQL + Next.js 14. Demo mode included — seed data, no GitHub account needed to try it.

```bash
docker compose up -d
npm run db:seed
# Open http://localhost:3000 — demo@devpulse.dev
```

MIT license. Looking for feedback on the detection heuristics and metric definitions.

https://github.com/TimurRakhmatullin86/devpulse-ai
