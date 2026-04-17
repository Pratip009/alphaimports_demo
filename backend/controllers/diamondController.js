const stones = require("../data/diamonds");  // renamed: file now exports all stones

/**
 * getProducts — backend-driven filtering + pagination
 * Supports multiple stone types (Diamond, Ruby, etc.)
 */
const getDiamonds = (req, res) => {
  try {
    const {
      minCarat,
      maxCarat,
      minMM,
      maxMM,
      shape,
      color,
      clarity,
      minPrice,
      maxPrice,
      stone,       // ← NEW: "Diamond" or "Ruby"
      sortBy = "price_asc",
      page = 1,
      limit = 12,
    } = req.query;

    const predicates = [];

    if (minCarat !== undefined)
      predicates.push((d) => d.carat >= parseFloat(minCarat));

    if (maxCarat !== undefined)
      predicates.push((d) => d.carat <= parseFloat(maxCarat));

    if (minMM !== undefined)
      predicates.push((d) => d.mm >= parseFloat(minMM));

    if (maxMM !== undefined)
      predicates.push((d) => d.mm <= parseFloat(maxMM));

    if (minPrice !== undefined)
      predicates.push((d) => d.price >= parseFloat(minPrice));

    if (maxPrice !== undefined)
      predicates.push((d) => d.price <= parseFloat(maxPrice));

    if (shape && shape.trim() !== "") {
      const shapeLower = shape.trim().toLowerCase();
      predicates.push((d) => d.shape.toLowerCase() === shapeLower);
    }

    // ── NEW: stone type filter ──────────────────────────────────────────────
    if (stone && stone.trim() !== "") {
      const stoneLower = stone.trim().toLowerCase();
      predicates.push((d) => (d.stone || "diamond").toLowerCase() === stoneLower);
    }

    // ── CHANGED: color is now case-insensitive full string match ───────────
    // Diamonds use "D","E","F" — Rubies use "Vivid Red","Pigeon Blood","Deep Red"
    if (color && color.trim() !== "") {
      const colorSet = new Set(
        color.split(",").map((c) => c.trim().toLowerCase())
      );
      predicates.push((d) => colorSet.has(d.color.toLowerCase())); // ← toLowerCase instead of toUpperCase
    }

    if (clarity && clarity.trim() !== "") {
      const claritySet = new Set(
        clarity.split(",").map((c) => c.trim().toUpperCase())
      );
      predicates.push((d) => claritySet.has(d.clarity.toUpperCase()));
    }

    // ── CHANGED: filter from `stones` (all products), not `diamonds` ───────
    let results =
      predicates.length === 0
        ? [...stones]
        : stones.filter((d) => predicates.every((fn) => fn(d)));

    const sortMap = {
      price_asc:   (a, b) => a.price - b.price,
      price_desc:  (a, b) => b.price - a.price,
      carat_asc:   (a, b) => a.carat - b.carat,
      carat_desc:  (a, b) => b.carat - a.carat,
      mm_asc:      (a, b) => a.mm - b.mm,
      mm_desc:     (a, b) => b.mm - a.mm,
    };
    if (sortMap[sortBy]) results.sort(sortMap[sortBy]);

    const pageNum    = Math.max(1, parseInt(page, 10));
    const pageSize   = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const total      = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIdx   = (pageNum - 1) * pageSize;
    const paginated  = results.slice(startIdx, startIdx + pageSize);

    res.json({
      success: true,
      data: paginated,
      meta: { total, page: pageNum, limit: pageSize, totalPages,
              hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 },
    });
  } catch (err) {
    console.error("[getDiamonds]", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * getFilterMeta — now scoped by stone type so Ruby and Diamond
 * each return their own color/clarity options.
 * Query: GET /api/products/meta?stone=Ruby
 */
const getFilterMeta = (req, res) => {
  try {
    const { stone } = req.query;  // ← NEW: accept stone param

    // ── NEW: filter dataset by stone before computing meta ─────────────────
    const dataset = stone
      ? stones.filter((d) => (d.stone || "diamond").toLowerCase() === stone.toLowerCase())
      : stones;

    const stoneTypes = [...new Set(stones.map((d) => d.stone || "Diamond"))].sort(); // ← NEW
    const shapes     = [...new Set(dataset.map((d) => d.shape))].sort();
    const colors     = [...new Set(dataset.map((d) => d.color))].sort();
    const clarities  = [...new Set(dataset.map((d) => d.clarity))].sort();

    const prices = dataset.map((d) => d.price);
    const carats = dataset.map((d) => d.carat);
    const mms    = dataset.map((d) => d.mm);

    res.json({
      success: true,
      data: {
        stoneTypes,   // ← NEW: ["Diamond", "Ruby"]
        shapes,
        colors,
        clarities,
        priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
        caratRange: { min: Math.min(...carats), max: Math.max(...carats) },
        mmRange:    { min: Math.min(...mms),    max: Math.max(...mms) },
      },
    });
  } catch (err) {
    console.error("[getFilterMeta]", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getDiamonds, getFilterMeta };