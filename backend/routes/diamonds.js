const express = require("express");
const router = express.Router();
const { getDiamonds, getFilterMeta } = require("../controllers/diamondController");

// GET /api/products        — filtered + paginated diamond list
router.get("/products", getDiamonds);

// GET /api/products/meta   — filter option ranges & values
router.get("/products/meta", getFilterMeta);

module.exports = router;
