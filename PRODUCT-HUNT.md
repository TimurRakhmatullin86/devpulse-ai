# Product Hunt Launch — DevPulse AI

## Tagline (60 chars max)
Measure if AI coding tools deliver ROI — or cost you in rework

## Description

Your team uses Copilot, Cursor, and Claude Code. That's $19-100/dev/month. On 100 developers, you're spending $24K-120K/year.

But is it worth it?

DevPulse AI connects to your GitHub repos, detects which pull requests used AI tools, and shows you the honest numbers:

- **Speed Multiplier** — AI-assisted PRs merge 2x faster
- **Rework Rate** — but 12-15% need fixes within 14 days (vs 7-9% for non-AI)
- **Net Productivity Score** — one number: speed gain minus quality cost

No vendor dashboards showing you only the good side. No "10x developer" marketing. Just data.

**Open-source. Self-hosted. MIT license.** The commercial alternative (Exceeds AI) charges $49/manager/month.

## Maker Comment

I built DevPulse AI because I couldn't answer a simple question from our CFO: "Are AI coding tools worth the $60K/year we spend on them?"

I looked at existing tools. Exceeds AI raised $4.6M but charges $49/manager/month. GitHub's Copilot Metrics Viewer only covers Copilot. Jellyfish, LinearB, GetDX measure velocity but can't attribute code to AI.

So I built what I needed: connect GitHub, detect AI-assisted PRs, see the trade-offs. Speed vs quality. Not one or the other.

The detection is honest about limitations — it's marker-based (Co-Authored-By headers, commit patterns), not AST analysis. If someone removes the markers, it's invisible. I'd rather under-count than over-count.

Try the demo: seed data included, no GitHub account needed.

## Topics
- Developer Tools
- Artificial Intelligence
- Open Source
- Productivity
- Analytics

## Links
- GitHub: https://github.com/TimurRakhmatullin86/devpulse-ai
- Demo: [Vercel URL after deploy]

## Gallery Images Needed
1. Dashboard — Executive Summary with ROI score
2. Speed vs Quality comparison chart
3. Per-developer scatter plot
4. Weekly trends over 12 weeks
5. CLI / Docker setup terminal screenshot

## Launch Strategy
- Best day: Tuesday or Wednesday
- Best time: 12:01 AM PT (Product Hunt timezone)
- Pre-launch: collect 5-10 followers on PH page
- Day-of: Share on Twitter, LinkedIn, dev.to, HN
- Key ask: "What metrics would YOU want to see for AI tool ROI?"
