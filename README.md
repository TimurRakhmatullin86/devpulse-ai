# DevPulse AI

**Analytics dashboard for measuring ROI of AI coding tools in development teams.**

DevPulse AI helps engineering leaders answer the question: *"Is our investment in AI tools actually paying off?"*

## The Problem

Organizations spend $20-100+/developer/month on AI coding assistants (Copilot, Cursor, Claude Code, etc.), but have no way to measure:
- Are developers actually more productive?
- Which AI tools deliver the most value?
- What's the actual ROI in dollars?
- How does AI adoption vary across teams?

## What DevPulse AI Does

DevPulse AI integrates with your existing development infrastructure to provide:

### 📊 Key Metrics
- **Velocity Delta** — PR throughput before vs after AI adoption
- **Cycle Time Reduction** — time from first commit to merge
- **AI Acceptance Rate** — % of AI suggestions kept vs discarded
- **Cost per Developer Hour Saved** — actual dollar ROI
- **Code Quality Score** — defect rates, test coverage changes

### 🔌 Integrations
- **Git providers**: GitHub, GitLab, Bitbucket
- **AI tools**: GitHub Copilot, Cursor, Claude Code, Cody, Tabnine
- **Project management**: Jira, Linear, Shortcut
- **CI/CD**: GitHub Actions, GitLab CI, CircleCI

### 📈 Dashboard Views
- **Executive Summary** — high-level ROI and adoption metrics
- **Team Breakdown** — per-team and per-developer analytics
- **Tool Comparison** — head-to-head AI tool effectiveness
- **Trend Analysis** — adoption curves and productivity over time
- **Cost Center** — spend tracking and ROI calculations

## Quick Start

```bash
# Clone the repository
git clone https://github.com/timur-rakhmatullin/devpulse-ai.git
cd devpulse-ai

# Install dependencies
npm install

# Configure data sources (copy and edit)
cp config.example.json config.json

# Start the dashboard
npm start
```

Open `http://localhost:3000` in your browser.

### Demo Mode

To explore with synthetic data:

```bash
npm run demo
```

Or open `dashboard.html` directly in a browser for the standalone demo.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  DevPulse AI                     │
├──────────┬──────────┬──────────┬────────────────┤
│  GitHub  │  Copilot │   Jira   │   CI/CD        │
│  API     │  Telemetry│  API    │   Metrics      │
├──────────┴──────────┴──────────┴────────────────┤
│              Data Ingestion Layer                │
│         (event-driven, incremental sync)         │
├─────────────────────────────────────────────────┤
│              Analytics Engine                    │
│    ┌─────────┐ ┌──────────┐ ┌──────────────┐   │
│    │Velocity │ │ Quality  │ │  Cost/ROI    │   │
│    │Analyzer │ │ Tracker  │ │  Calculator  │   │
│    └─────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────┤
│              Dashboard UI                        │
│         (real-time, interactive charts)           │
└─────────────────────────────────────────────────┘
```

## Configuration

```json
{
  "dataSources": {
    "github": {
      "token": "ghp_...",
      "org": "your-org",
      "repos": ["repo1", "repo2"]
    },
    "copilot": {
      "enabled": true
    },
    "jira": {
      "baseUrl": "https://your-org.atlassian.net",
      "token": "..."
    }
  },
  "teams": {
    "backend": ["dev1", "dev2"],
    "frontend": ["dev3", "dev4"]
  },
  "aiTools": {
    "adoptionDate": "2024-06-01",
    "tools": ["copilot", "cursor", "claude-code"]
  },
  "costs": {
    "copilot": { "perSeat": 19, "currency": "USD" },
    "cursor": { "perSeat": 20, "currency": "USD" },
    "claude-code": { "perSeat": 100, "currency": "USD" }
  }
}
```

## Metrics Methodology

### Velocity Delta
Compares PR merge rate in rolling 30-day windows before and after AI tool adoption. Normalized by team size and adjusted for seasonal patterns.

### ROI Calculation
```
ROI = (Hours Saved × Average Developer Hourly Cost - Tool Licensing Cost) / Tool Licensing Cost × 100%
```

Where:
- **Hours Saved** = Δ(cycle_time) × number_of_PRs
- **Average Developer Hourly Cost** = configurable (default: $75/hr)
- **Tool Licensing Cost** = sum of per-seat costs × active users

### AI Acceptance Rate
Tracked via editor telemetry (where available) or estimated from commit patterns showing AI-generated code retention.

## Privacy & Security

- All data stays within your infrastructure
- No telemetry sent to DevPulse AI servers
- API tokens stored locally, never transmitted
- Aggregated metrics only — no individual keystroke tracking
- GDPR-compliant: developer-level data can be anonymized

## Tech Stack

- **Frontend**: Vanilla JS + Chart.js (zero framework dependencies)
- **Backend**: Node.js with Express (optional, for API integrations)
- **Database**: SQLite (embedded, zero config)
- **Charts**: Chart.js 4.x with custom plugins

## Roadmap

- [ ] Slack/Teams bot for weekly ROI reports
- [ ] ML-based anomaly detection for productivity drops
- [ ] Custom metric builder (drag-and-drop)
- [ ] Export to PDF/CSV for board presentations
- [ ] Multi-org support for enterprises
- [ ] Benchmark against industry averages

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

**Timur Rakhmatullin** — [GitHub](https://github.com/timur-rakhmatullin)

Built to solve a real problem: proving that AI tools deliver measurable value to engineering organizations.
