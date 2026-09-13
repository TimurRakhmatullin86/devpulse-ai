# Contributing to DevPulse AI

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/devpulse-ai.git`
3. Install dependencies: `npm install`
4. Start in demo mode: `npm run demo`

## Development

- **Frontend**: Edit `dashboard.html` — it's a self-contained single-page app
- **Backend**: Edit files in `src/` — Node.js with Express
- **Data sources**: Add new integrations in `src/integrations/`

## Code Style

- No framework dependencies for the frontend (vanilla JS)
- Use modern JavaScript (ES2022+, Node 18+)
- Keep the dashboard usable as a standalone HTML file (no build step required)

## Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request with a clear description

## Adding a New Data Source Integration

1. Create `src/integrations/your-source.js`
2. Export a class implementing the `DataSource` interface
3. Add configuration options to `config.example.json`
4. Add a chart or table to `dashboard.html`
5. Update README with the new integration

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/Node version

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
