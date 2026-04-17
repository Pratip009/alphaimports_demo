import { useState, useEffect, useCallback } from "react";
import { fetchDiamonds } from "../utils/api";
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
  const [diamonds, setDiamonds] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedFilters = useDebounce(filters, 350);

  const load = useCallback(async (activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDiamonds(activeFilters);
      setDiamonds(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(debouncedFilters);
  }, [debouncedFilters, load]);

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
    loading,
    error,
    filters,
    setFilter,
    toggleMultiSelect,
    setPage,
    resetFilters,
    activeFilterCount,
  };
}