# DevPulse AI — Demo Setup

Run the full dashboard with pre-loaded demo data. No GitHub account or OAuth app required.

## Quick Start

```bash
# 1. Start PostgreSQL (requires Docker)
docker compose up -d db

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env — set DATABASE_URL to:
#   postgresql://devpulse:devpulse@localhost:5432/devpulse
# Set NEXTAUTH_SECRET to any random string (e.g. "demo-secret-change-me")
# GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET can stay empty for demo mode

# 4. Push schema and seed data
npx prisma db push
npm run db:seed

# 5. Start the app
npm run dev
# Open http://localhost:3000
```

## Demo Login

Sign in with the demo credentials provider using:

- **Email:** `demo@devpulse.dev`

No password is needed. The demo user has admin access to "Acme Corp" with full sample data.

## What's Included

The seed generates realistic data for a fictional engineering org:

| Entity | Count | Details |
|--------|-------|---------|
| Organization | 1 | Acme Corp |
| Repositories | 4 | web-app (React), api-server (Go), ml-pipeline (Python), infra (Terraform) |
| Developers | 8 | 2 AI power users, 3 moderate, 2 traditional, 1 skeptic |
| Pull Requests | ~250 | Spread over 90 days with realistic titles |
| PR Metrics | ~250 | Cycle time, rework, bugs, review comments |
| Weekly Snapshots | 12 | Pre-computed weekly aggregates |

## Data Story

The demo data illustrates the real trade-offs of AI coding tools:

- **Speed:** AI-assisted PRs merge in ~4-5 hours vs ~8-10 hours for traditional PRs (2x speedup)
- **Quality:** AI PRs have slightly higher rework rates (12-15% vs 7-9%) and more review comments
- **Adoption:** AI usage grows from ~15% to ~38% over the 12-week period
- **Net ROI:** Positive but modest (+12 to +17%), reflecting that speed gains partially offset quality costs
- **Individual variation:** Power users ship faster but have more rework; the skeptic has the lowest rework rate

## Resetting Data

```bash
npm run db:seed
```

The seed script cleans all existing data before inserting, so it's safe to re-run.

## Prisma Studio

Browse the raw data:

```bash
npm run db:studio
```

Opens at http://localhost:5555.
