const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const openings = {
  developer: [
    { id: 1, title: 'Senior Frontend Engineer', team: 'Platform', location: 'Remote', openings: 2 },
    { id: 2, title: 'Angular Developer',        team: 'Core UI',  location: 'Bangalore, India', openings: 3 },
    { id: 3, title: 'Full Stack Engineer',       team: 'Growth',   location: 'Remote', openings: 1 },
    { id: 4, title: 'Node.js Backend Engineer',  team: 'API',      location: 'Hyderabad, India', openings: 2 },
  ],
  admin: [
    { id: 5,  title: 'IT Administrator',          team: 'IT Ops',  location: 'Delhi, India', openings: 1 },
    { id: 6,  title: 'System Administrator',      team: 'Infra',   location: 'Remote', openings: 2 },
    { id: 7,  title: 'Database Administrator',    team: 'Data',    location: 'Bangalore, India', openings: 1 },
  ],
  hr: [
    { id: 8,  title: 'HR Business Partner',       team: 'People',  location: 'Gurgaon, India', openings: 2 },
    { id: 9,  title: 'Talent Acquisition Lead',   team: 'Hiring',  location: 'Remote', openings: 1 },
    { id: 10, title: 'HR Operations Specialist',  team: 'People',  location: 'Mumbai, India', openings: 3 },
  ],
  accounts: [
    { id: 11, title: 'Accounts Manager',          team: 'Finance', location: 'Delhi, India', openings: 1 },
    { id: 12, title: 'Financial Analyst',         team: 'Finance', location: 'Remote', openings: 2 },
    { id: 13, title: 'Payroll Specialist',        team: 'Finance', location: 'Gurgaon, India', openings: 1 },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simulates real-world latency per department */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function respond(res, category, ms = 100) {
  delay(ms).then(() => {
    res.json({
      category,
      count: openings[category].length,
      jobs: openings[category],
    });
  });
}

// ---------------------------------------------------------------------------
// Routes — individual department endpoints
// ---------------------------------------------------------------------------

app.get('/api/careers/developer', (req, res) => respond(res, 'developer', 80));
app.get('/api/careers/admin',     (req, res) => respond(res, 'admin',     120));
app.get('/api/careers/hr',        (req, res) => respond(res, 'hr',        60));
app.get('/api/careers/accounts',  (req, res) => respond(res, 'accounts',  100));

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => res.json({ status: 'ok', port: PORT }));

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Careers API running at http://localhost:${PORT}`);
  console.log('  GET /api/careers/developer');
  console.log('  GET /api/careers/admin');
  console.log('  GET /api/careers/hr');
  console.log('  GET /api/careers/accounts');
});
