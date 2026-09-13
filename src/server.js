const express = require('express');
const path = require('path');
const { generateDemoData } = require('./demo-data');

const app = express();
const PORT = process.env.PORT || 3000;
const DEMO_MODE = process.env.DEMO_MODE === 'true';

app.use(express.static(path.join(__dirname, '..')));
app.use(express.json());

let metricsCache = null;

function getMetrics() {
  if (DEMO_MODE || !metricsCache) {
    metricsCache = generateDemoData();
  }
  return metricsCache;
}

app.get('/api/metrics/summary', (_req, res) => {
  const data = getMetrics();
  res.json(data.summary);
});

app.get('/api/metrics/velocity', (req, res) => {
  const data = getMetrics();
  const { team, period } = req.query;
  let result = data.velocity;
  if (team && team !== 'all') {
    result = result.filter(v => v.team === team);
  }
  if (period) {
    const days = parseInt(period, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    result = result.filter(v => new Date(v.date) >= cutoff);
  }
  res.json(result);
});

app.get('/api/metrics/tools', (_req, res) => {
  const data = getMetrics();
  res.json(data.tools);
});

app.get('/api/metrics/teams', (_req, res) => {
  const data = getMetrics();
  res.json(data.teams);
});

app.get('/api/metrics/roi', (_req, res) => {
  const data = getMetrics();
  res.json(data.roi);
});

app.get('/api/metrics/trends', (req, res) => {
  const data = getMetrics();
  const { metric } = req.query;
  if (metric && data.trends[metric]) {
    res.json(data.trends[metric]);
  } else {
    res.json(data.trends);
  }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
});

app.listen(PORT, () => {
  const mode = DEMO_MODE ? ' (DEMO MODE)' : '';
  console.log(`DevPulse AI running at http://localhost:${PORT}${mode}`);
});
