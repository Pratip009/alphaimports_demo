const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export function buildQueryString(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length > 0) qs.set(key, value.join(","));
    } else {
      qs.set(key, String(value));
    }
  });
  return qs.toString();
}

export async function fetchDiamonds(filters = {}) {
  const qs = buildQueryString(filters);
  const url = `${BASE_URL}/products${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}