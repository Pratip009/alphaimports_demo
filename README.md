# 💎 Alpha Imports — Diamond eCommerce Platform (Phase 1)

A production-ready diamond catalogue with **backend-driven filtering**, pagination, and a luxury React UI. Built with Node.js + Express on the backend and React (Vite) + Tailwind CSS on the frontend.

---

## 📁 Folder Structure

```
diamond-platform/
├── backend/
│   ├── controllers/
│   │   └── diamondController.js   ← All filtering + pagination logic
│   ├── routes/
│   │   └── diamonds.js            ← Express route declarations
│   ├── data/
│   │   └── diamonds.js            ← In-memory dataset (35 products)
│   ├── middleware/
│   │   └── requestLogger.js       ← Structured request logger
│   ├── server.js                  ← Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         ← Sticky nav bar
│   │   │   ├── FilterPanel.jsx    ← All filter controls
│   │   │   ├── ProductGrid.jsx    ← Grid + skeleton + pagination
│   │   │   └── ProductCard.jsx    ← Individual diamond card
│   │   ├── hooks/
│   │   │   ├── useDiamonds.js     ← Fetching + filter state manager
│   │   │   └── useDebounce.js     ← Prevents API call on every keystroke
│   │   ├── utils/
│   │   │   └── api.js             ← Fetch helpers + query builder
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              ← Tailwind + custom luxury tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── .env.example
│
├── render.yaml                    ← Render deployment config
└── README.md
```

---

## 🚀 Local Setup (Step-by-Step)

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### 1. Clone / unzip the project

```bash
cd diamond-platform
```

### 2. Start the Backend

```bash
cd backend
cp .env.example .env        # copy env vars
npm install                 # install: express, cors, helmet
npm run dev                 # starts on http://localhost:4000
```

Test it works:

```bash
curl "http://localhost:4000/health"
curl "http://localhost:4000/api/products?shape=Round&color=D,E&minCarat=1"
curl "http://localhost:4000/api/products/meta"
```

### 3. Start the Frontend

```bash
# In a new terminal:
cd frontend
cp .env.example .env        # VITE_API_URL can stay blank for local dev
npm install
npm run dev                 # starts on http://localhost:5173
```

Open **http://localhost:5173** — the Vite proxy forwards `/api` calls to port 4000.

---

## 🔌 API Reference

### `GET /api/products`

Returns filtered, sorted, and paginated diamonds.

| Query Param | Type   | Example     | Description                                       |
| ----------- | ------ | ----------- | ------------------------------------------------- |
| `minCarat`  | number | `1.0`       | Minimum carat weight (inclusive)                  |
| `maxCarat`  | number | `3.0`       | Maximum carat weight (inclusive)                  |
| `minMM`     | number | `5.0`       | Minimum mm size                                   |
| `maxMM`     | number | `10.0`      | Maximum mm size                                   |
| `minPrice`  | number | `2000`      | Minimum price USD                                 |
| `maxPrice`  | number | `8000`      | Maximum price USD                                 |
| `shape`     | string | `Round`     | Exact shape match (case-insensitive)              |
| `color`     | string | `D,E,F`     | Comma-separated multi-select                      |
| `clarity`   | string | `IF,VVS1`   | Comma-separated multi-select                      |
| `sortBy`    | string | `price_asc` | `price_asc/desc`, `carat_asc/desc`, `mm_asc/desc` |
| `page`      | number | `1`         | Page number (default: 1)                          |
| `limit`     | number | `12`        | Results per page (max: 50)                        |

**Example response:**

```json
{
  "success": true,
  "data": [ ...diamonds ],
  "meta": {
    "total": 14,
    "page": 1,
    "limit": 12,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### `GET /api/products/meta`

Returns available filter options derived from the live dataset.

```json
{
  "success": true,
  "data": {
    "shapes": ["Cushion", "Oval", "Princess", "Round"],
    "colors": ["D", "E", "F", "G", "H"],
    "clarities": ["IF", "VS1", "VS2", "VVS1", "VVS2"],
    "priceRange": { "min": 1850, "max": 38000 },
    "caratRange": { "min": 0.5, "max": 10 },
    "mmRange": { "min": 4.6, "max": 14.2 }
  }
}
```

---

## ⚡ Performance Architecture

### Why backend filtering instead of frontend?

| Concern            | Frontend filtering           | Backend filtering (this app)        |
| ------------------ | ---------------------------- | ----------------------------------- |
| **Payload size**   | Downloads entire dataset     | Sends only matching results         |
| **Scalability**    | Breaks at 10k+ products      | Same API works for millions with DB |
| **Security**       | Dataset exposed to client    | Only results are sent               |
| **Business logic** | Duplicated in every client   | Single source of truth              |
| **Caching**        | Can't cache by filter combos | CDN/Redis can cache query results   |

### How in-memory filtering is optimized

The filtering engine in `diamondController.js` uses a **single O(n) pass**:

```js
// 1. Build predicate array ONCE from all active filters
const predicates = [];
if (minCarat) predicates.push((d) => d.carat >= parseFloat(minCarat));
if (color) predicates.push((d) => colorSet.has(d.color)); // Set = O(1) lookup

// 2. One .filter() pass — predicates short-circuit on first false
const results = diamonds.filter((d) => predicates.every((fn) => fn(d)));
```

- **No intermediate arrays** created for each filter
- **Set lookups** for multi-select (color, clarity) are O(1) vs O(n) for array includes
- **Cheap filters first** (range checks) before expensive string comparisons
- **Pagination slices last** — only after filtering, no wasted work

---

## 🗄️ PostgreSQL Migration Guide

### Step 1 — Schema design

```sql
CREATE TABLE diamonds (
  id        VARCHAR(10) PRIMARY KEY,
  name      TEXT NOT NULL,
  price     NUMERIC(10,2) NOT NULL,
  carat     NUMERIC(5,2) NOT NULL,
  mm        NUMERIC(5,2) NOT NULL,
  shape     VARCHAR(20) NOT NULL,
  color     CHAR(1) NOT NULL,
  clarity   VARCHAR(5) NOT NULL,
  image_url TEXT
);

-- Indexes for every filtered column
CREATE INDEX idx_diamonds_shape   ON diamonds (shape);
CREATE INDEX idx_diamonds_color   ON diamonds (color);
CREATE INDEX idx_diamonds_clarity ON diamonds (clarity);
CREATE INDEX idx_diamonds_carat   ON diamonds (carat);
CREATE INDEX idx_diamonds_mm      ON diamonds (mm);
CREATE INDEX idx_diamonds_price   ON diamonds (price);
```

### Step 2 — Replace the controller

Each predicate maps directly to a SQL WHERE clause:

```js
// In-memory:  d => d.carat >= parseFloat(minCarat)
// PostgreSQL: WHERE carat >= $1

const conditions = [];
const values = [];

if (minCarat) {
  conditions.push(`carat >= $${values.length + 1}`);
  values.push(minCarat);
}
if (maxCarat) {
  conditions.push(`carat <= $${values.length + 1}`);
  values.push(maxCarat);
}
if (shape) {
  conditions.push(`shape  = $${values.length + 1}`);
  values.push(shape);
}
if (color) {
  // Multi-select → SQL ANY
  conditions.push(`color = ANY($${values.length + 1})`);
  values.push(color.split(","));
}

const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
const sql = `SELECT * FROM diamonds ${where} ORDER BY ${orderCol} LIMIT $x OFFSET $y`;
```

### Step 3 — Add count query for pagination

```sql
SELECT COUNT(*) FROM diamonds WHERE <same conditions>;
```

### Step 4 — Add connection pool

```js
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

### Scaling to thousands of products

| Technique             | How                                           |
| --------------------- | --------------------------------------------- |
| **B-tree indexes**    | Already shown above — O(log n) range queries  |
| **Partial indexes**   | `WHERE shape = 'Round'` for hot filter combos |
| **Redis cache**       | Cache popular filter combos (TTL: 60s)        |
| **Cursor pagination** | Replace page/offset with `WHERE id > lastId`  |
| **Read replicas**     | Route all GET queries to replica              |
| **Full-text search**  | Add `tsvector` column for name search         |

---

## 🌐 Deployment Guide

### Backend → Render (Free tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variable: `FRONTEND_URL=https://your-app.vercel.app`
7. Deploy — Render gives you a URL like `https://diamond-api.onrender.com`

The `render.yaml` in the repo root auto-configures this.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Framework: **Vite** (auto-detected)
4. Add environment variable:
   ```
   VITE_API_URL=https://diamond-api.onrender.com/api
   ```
5. Deploy — Vercel gives you a URL like `https://lumiere-diamonds.vercel.app`

The `vercel.json` handles SPA routing rewrites automatically.

### Update CORS after deployment

In your Render dashboard, update `FRONTEND_URL` to your actual Vercel URL.

---

## 🛠️ Tech Stack Summary

| Layer      | Technology             | Purpose                          |
| ---------- | ---------------------- | -------------------------------- |
| Frontend   | React 18 + Vite        | Fast SPA with HMR                |
| Styling    | Tailwind CSS v3        | Utility-first, luxury theme      |
| Backend    | Node.js + Express 4    | RESTful API                      |
| Filtering  | In-memory JS (Phase 1) | Single-pass O(n) predicate chain |
| Deployment | Render + Vercel        | Free-tier production hosting     |

---

## 🔮 Phase 2 Roadmap (suggested)

- [ ] PostgreSQL with Prisma ORM
- [ ] Product detail page with 360° image viewer
- [ ] Wishlist with localStorage persistence
- [ ] Search with debounced full-text query
- [ ] Admin panel to add/edit diamonds
- [ ] Redis caching for popular filter combos
- [ ] Auth (Clerk or NextAuth) for saved preferences
