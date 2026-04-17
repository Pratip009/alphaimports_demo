import { useState, useMemo } from "react";
import { diamonds as ALL_DIAMONDS } from "../data/diamonds";
import { useDebounce } from "./useDebounce";

const DEFAULT_FILTERS = {
  stone: "Diamond",
  minCarat: "",
  maxCarat: "",
  minMM: "",
  maxMM: "",
  minPrice: "",
  maxPrice: "",
  shape: "",
  color: [],
  clarity: [],
  sortBy: "price_asc",
  page: 1,
  limit: 12,
};

export function useDiamonds() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const debouncedFilters = useDebounce(filters, 350);

  const { diamonds, meta } = useMemo(() => {
    let result = [...ALL_DIAMONDS];

    // ── Filter ──────────────────────────────────────────────
    if (debouncedFilters.stone) {
      result = result.filter((d) => d.stone === debouncedFilters.stone);
    }
    if (debouncedFilters.shape) {
      result = result.filter((d) => d.shape === debouncedFilters.shape);
    }
    if (debouncedFilters.color.length > 0) {
      result = result.filter((d) => debouncedFilters.color.includes(d.color));
    }
    if (debouncedFilters.clarity.length > 0) {
      result = result.filter((d) => debouncedFilters.clarity.includes(d.clarity));
    }
    if (debouncedFilters.minCarat !== "") {
      result = result.filter((d) => d.carat >= parseFloat(debouncedFilters.minCarat));
    }
    if (debouncedFilters.maxCarat !== "") {
      result = result.filter((d) => d.carat <= parseFloat(debouncedFilters.maxCarat));
    }
    if (debouncedFilters.minMM !== "") {
      result = result.filter((d) => d.mm >= parseFloat(debouncedFilters.minMM));
    }
    if (debouncedFilters.maxMM !== "") {
      result = result.filter((d) => d.mm <= parseFloat(debouncedFilters.maxMM));
    }
    if (debouncedFilters.minPrice !== "") {
      result = result.filter((d) => d.price >= parseFloat(debouncedFilters.minPrice));
    }
    if (debouncedFilters.maxPrice !== "") {
      result = result.filter((d) => d.price <= parseFloat(debouncedFilters.maxPrice));
    }

    // ── Sort ────────────────────────────────────────────────
    result.sort((a, b) => {
      switch (debouncedFilters.sortBy) {
        case "price_asc":  return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "carat_asc":  return a.carat - b.carat;
        case "carat_desc": return b.carat - a.carat;
        default:           return 0;
      }
    });

    // ── Paginate ────────────────────────────────────────────
    const total      = result.length;
    const totalPages = Math.ceil(total / debouncedFilters.limit);
    const start      = (debouncedFilters.page - 1) * debouncedFilters.limit;
    const paginated  = result.slice(start, start + debouncedFilters.limit);

    return {
      diamonds: paginated,
      meta: {
        total,
        totalPages,
        page:  debouncedFilters.page,
        limit: debouncedFilters.limit,
      },
    };
  }, [debouncedFilters]);

  // ── Filter setters ──────────────────────────────────────────────────────
  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const toggleMultiSelect = (key, value) =>
    setFilters((prev) => {
      const next = prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value];
      return { ...prev, [key]: next, page: 1 };
    });

  const setPage = (page) =>
    setFilters((prev) => ({ ...prev, page }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeFilterCount = [
    filters.minCarat || filters.maxCarat,
    filters.minMM    || filters.maxMM,
    filters.minPrice || filters.maxPrice,
    filters.shape,
    filters.color.length   > 0,
    filters.clarity.length > 0,
  ].filter(Boolean).length;

  return {
    diamonds,
    meta,
    loading: false,   // no async, instant
    error:   null,
    filters,
    setFilter,
    toggleMultiSelect,
    setPage,
    resetFilters,
    activeFilterCount,
  };
}