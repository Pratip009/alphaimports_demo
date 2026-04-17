import React from "react";
import Header from "./components/Header";
import FilterPanel from "./components/FilterPanel";
import ProductGrid from "./components/ProductGrid";
import { useDiamonds } from "./hooks/useDiamonds";

export default function App() {
  const {
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
  } = useDiamonds();

  return (
    <div className="min-h-screen bg-obsidian-900 text-white">
      <Header />

      {/* Hero banner */}
      <section className="border-b border-elevated py-12 px-6">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-champagne mb-3">
            Phase I Collection
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white leading-tight">
            Exceptional Diamonds,
            <br />
            <span className="italic font-normal text-champagne">
              Extraordinary Precision
            </span>
          </h1>
          <div className="gold-line w-24 mt-6" />
        </div>
      </section>

      {/* Main layout */}
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterPanel
            filters={filters}
            setFilter={setFilter}
            toggleMultiSelect={toggleMultiSelect}
            resetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
          />
          <ProductGrid
            diamonds={diamonds}
            loading={loading}
            error={error}
            meta={meta}
            onReset={resetFilters}
            onPageChange={setPage}
            currentPage={filters.page}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-elevated mt-20 py-10 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display italic text-obsidian-400 text-sm">
            Alpha Imports Fine Diamonds — Phase 1 Demo
          </p>
          <p className="font-sans text-xs text-obsidian-500 tracking-wider">
            Crafted with precision · Powered by Node.js + React
          </p>
        </div>
      </footer>
    </div>
  );
}
