const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const usernames = require('./usernames.json');

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

app.get('/api/careers/developer', (_req, res) => respond(res, 'developer', 10000));
app.get('/api/careers/admin',     (_req, res) => respond(res, 'admin',     10000));
app.get('/api/careers/hr',        (_req, res) => respond(res, 'hr',        10000));
app.get('/api/careers/accounts',  (_req, res) => respond(res, 'accounts',  10000));

// ---------------------------------------------------------------------------
// Username availability — GET /api/username/check?query=deepak
// 10 second simulated delay so switchMap cancellation is visible in Network tab
// ---------------------------------------------------------------------------

app.get('/api/username/check', (req, res) => {
  const query = (req.query.query || '').toString().trim().toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'query param is required' });
  }

  setTimeout(() => {
    const taken = usernames.map(u => u.toLowerCase()).includes(query);
    res.json({
      query,
      available: !taken,
      message: taken
        ? `"${query}" is already taken`
        : `"${query}" is available`,
    });
  }, 10000); // 10 second delay
});

// ---------------------------------------------------------------------------
// Products data
// ---------------------------------------------------------------------------

const products = [
  { id: 1,  name: 'MacBook Pro 14"',            category: 'electronics', price: 1999, rating: 4.8, stock: 5  },
  { id: 2,  name: 'Dell XPS 15',                category: 'electronics', price: 1599, rating: 4.6, stock: 3  },
  { id: 3,  name: 'Sony WH-1000XM5',            category: 'electronics', price: 349,  rating: 4.9, stock: 0  },
  { id: 4,  name: 'iPad Pro 12.9"',             category: 'electronics', price: 1099, rating: 4.7, stock: 8  },
  { id: 5,  name: 'Samsung 4K Monitor',         category: 'electronics', price: 599,  rating: 4.5, stock: 4  },
  { id: 6,  name: 'Mechanical Keyboard',        category: 'electronics', price: 149,  rating: 4.4, stock: 12 },
  { id: 7,  name: 'Logitech MX Master 3',       category: 'electronics', price: 99,   rating: 4.7, stock: 7  },
  { id: 8,  name: 'USB-C Hub 10-in-1',          category: 'electronics', price: 59,   rating: 4.3, stock: 20 },
  { id: 9,  name: 'Clean Code',                 category: 'books',       price: 35,   rating: 4.9, stock: 15 },
  { id: 10, name: "You Don't Know JS",          category: 'books',       price: 29,   rating: 4.8, stock: 9  },
  { id: 11, name: 'The Pragmatic Programmer',   category: 'books',       price: 40,   rating: 4.7, stock: 0  },
  { id: 12, name: 'Designing Data-Intensive Apps', category: 'books',    price: 55,   rating: 4.9, stock: 6  },
  { id: 13, name: 'Angular Up & Running',       category: 'books',       price: 45,   rating: 4.5, stock: 11 },
  { id: 14, name: 'RxJS in Action',             category: 'books',       price: 38,   rating: 4.6, stock: 8  },
  { id: 15, name: 'Ergonomic Chair',            category: 'furniture',   price: 499,  rating: 4.6, stock: 2  },
  { id: 16, name: 'Standing Desk',              category: 'furniture',   price: 799,  rating: 4.7, stock: 0  },
  { id: 17, name: 'Monitor Arm',               category: 'furniture',   price: 89,   rating: 4.5, stock: 10 },
  { id: 18, name: 'Desk Mat XL',               category: 'furniture',   price: 39,   rating: 4.4, stock: 25 },
  { id: 19, name: 'LED Desk Lamp',             category: 'furniture',   price: 69,   rating: 4.3, stock: 14 },
  { id: 20, name: 'Webcam 4K',                 category: 'electronics', price: 199,  rating: 4.5, stock: 3  },
];

// ---------------------------------------------------------------------------
// Products — GET /api/products?search=mac&category=electronics
// ---------------------------------------------------------------------------

app.get('/api/products', (req, res) => {
  const search   = (req.query.search   || '').toString().trim().toLowerCase();
  const category = (req.query.category || '').toString().trim().toLowerCase();

  let results = products;

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }

  if (search) {
    results = results.filter(p => p.name.toLowerCase().includes(search));
  }

  // Simulate network latency
  setTimeout(() => {
    res.json({ results, total: results.length });
  }, 600);
});

// ---------------------------------------------------------------------------
// Stock check — GET /api/products/:id/stock
// Deliberately slow (2s) so optimistic UI + rollback pattern is visible
// ---------------------------------------------------------------------------

app.get('/api/products/:id/stock', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  setTimeout(() => {
    res.json({ id, name: product.name, inStock: product.stock > 0, stock: product.stock });
  }, 2000);
});

// ---------------------------------------------------------------------------
// Add to cart — PATCH /api/products/:id/cart
// Decrements stock count by quantity (default 1).
// Returns 409 if out of stock.
// ---------------------------------------------------------------------------

app.patch('/api/products/:id/cart', (req, res) => {
  const id = parseInt(req.params.id);
  const quantity = parseInt(req.body.quantity) || 1;
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(409).json({
      error: 'Out of stock',
      id,
      name: product.name,
      stock: product.stock,
      inStock: false,
    });
  }

  product.stock -= quantity;

  console.log(`[CART] "${product.name}" — stock: ${product.stock + quantity} → ${product.stock}`);

  res.json({
    id,
    name: product.name,
    stock: product.stock,
    inStock: product.stock > 0,
    message: `Stock decremented by ${quantity}`,
  });
});

// ---------------------------------------------------------------------------
// Dynamic Form — POST /api/form/submit
// Saves payload as timestamped JSON file in ./submissions/
// ---------------------------------------------------------------------------

const SUBMISSIONS_DIR = path.join(__dirname, 'submissions');

app.post('/api/form/submit', (req, res) => {
  const payload = req.body;
  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({ error: 'Empty payload' });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename  = `submission-${timestamp}.json`;
  const filepath  = path.join(SUBMISSIONS_DIR, filename);

  const record = { submittedAt: new Date().toISOString(), data: payload };

  fs.writeFileSync(filepath, JSON.stringify(record, null, 2), 'utf8');
  console.log(`[FORM] Saved submission → ${filename}`);

  res.status(201).json({ success: true, filename, submittedAt: record.submittedAt });
});

// ---------------------------------------------------------------------------
// Chained API demo
// ---------------------------------------------------------------------------

// Fake user directory
const users = [
  { id: 101, name: 'Alice Johnson',  role: 'Frontend Engineer' },
  { id: 102, name: 'Bob Smith',      role: 'Backend Engineer'  },
  { id: 103, name: 'Carol White',    role: 'DevOps Engineer'   },
  { id: 104, name: 'Deepak Sharma',  role: 'Full Stack Engineer' },
  { id: 105, name: 'Eva Martinez',   role: 'QA Engineer'       },
];

const profiles = {
  101: { email: 'alice@company.io',  joined: '2021-03-15', skills: ['Angular', 'TypeScript', 'RxJS'],          bio: 'Loves building reactive UIs.' },
  102: { email: 'bob@company.io',    joined: '2020-07-22', skills: ['Node.js', 'PostgreSQL', 'Docker'],        bio: 'API design enthusiast.' },
  103: { email: 'carol@company.io',  joined: '2019-11-01', skills: ['Kubernetes', 'CI/CD', 'Terraform'],       bio: 'Keeps the pipelines green.' },
  104: { email: 'deepak@company.io', joined: '2022-01-10', skills: ['Angular', 'Node.js', 'MongoDB', 'RxJS'],  bio: 'Fullstack dev, coffee addict.' },
  105: { email: 'eva@company.io',    joined: '2023-05-18', skills: ['Cypress', 'Jest', 'Playwright'],          bio: 'Nothing ships without tests.' },
};

/**
 * Step 1 — search by name fragment
 * GET /api/user/search?name=alice
 * Returns basic user info: { id, name, role }
 */
app.get('/api/user/search', (req, res) => {
  const query = (req.query.name || '').toString().trim().toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'name query param is required' });
  }

  const match = users.find(u => u.name.toLowerCase().includes(query));

  if (!match) {
    return res.status(404).json({ error: `No user found matching "${query}"` });
  }

  // Simulate network delay
  setTimeout(() => {
    res.json({ id: match.id, name: match.name, role: match.role });
  }, 500);
});

/**
 * Step 2 — fetch full profile by the id returned from step 1
 * GET /api/user/:id/profile
 * Returns full details: { id, name, role, email, joined, skills, bio }
 */
app.get('/api/user/:id/profile', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  const profile = profiles[id];

  if (!user || !profile) {
    return res.status(404).json({ error: `User ${id} not found` });
  }

  setTimeout(() => {
    res.json({ id, name: user.name, role: user.role, ...profile });
  }, 500);
});

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
