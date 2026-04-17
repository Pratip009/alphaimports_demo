const BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * buildQueryString — converts a filter object into a URLSearchParams string.
 * Skips empty strings, undefined, and null values automatically.
 */
export function buildQueryString(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    // Arrays (color[], clarity[]) → comma-separated string
    if (Array.isArray(value)) {
      if (value.length > 0) qs.set(key, value.join(","));
    } else {
      qs.set(key, String(value));
    }
  });
  return qs.toString();
}

/**
 * fetchDiamonds — GET /api/products with filters
 */
export async function fetchDiamonds(filters = {}) {
  const qs = buildQueryString(filters);
  const url = `${BASE_URL}/products${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json(); // { success, data, meta }
}

/**
 * fetchFilterMeta — GET /api/products/meta
 */
export async function fetchFilterMeta() {
  const res = await fetch(`${BASE_URL}/products/meta`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json(); // { success, data: { shapes, colors, ... } }
}
