import React from "react";
import ProductCard from "./ProductCard";

function SkeletonCard() {
  return (
    <div className="bg-card border border-elevated rounded-xl overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 skeleton rounded w-3/4" />
          <div className="h-3 skeleton rounded w-1/3" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 skeleton rounded" />
          ))}
        </div>
        <div className="h-px skeleton" />
        <div className="flex justify-between items-center">
          <div className="h-6 skeleton rounded w-1/3" />
          <div className="h-7 skeleton rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-6 opacity-20">
        <path d="M32 4L60 22L32 60L4 22L32 4Z" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
        <path d="M4 22H60M32 4L18 22L32 60L46 22L32 4Z" stroke="#c9a96e" strokeWidth="1" fill="none" />
      </svg>
      <p className="font-serif text-2xl text-white mb-2">No diamonds found</p>
      <p className="text-sm text-obsidian-400 font-sans mb-6 max-w-xs">
        No diamonds match your current filters. Try adjusting your search criteria.
      </p>
      <button
        onClick={onReset}
        className="text-sm font-sans font-medium text-champagne border border-champagne/30 hover:border-champagne px-5 py-2.5 rounded-lg transition-all duration-200"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default function ProductGrid({ diamonds, loading, error, meta, onReset, onPageChange, currentPage }) {
  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-xl text-white mb-2">Connection Error</p>
        <p className="text-sm text-obsidian-400 font-sans">{error}</p>
        <p className="text-xs text-obsidian-400 font-sans mt-2">Make sure the backend server is running on port 4000.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Results bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-obsidian-400 font-sans">
          {loading ? (
            <span className="inline-block h-4 w-32 skeleton rounded" />
          ) : (
            <>
              <span className="text-white font-medium">{meta?.total ?? 0}</span> diamonds found
              {meta?.total > 0 && (
                <span className="ml-1">
                  — page {meta.page} of {meta.totalPages}
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
          : diamonds.length === 0
          ? <EmptyState onReset={onReset} />
          : diamonds.map((d, i) => (
              <div
                key={d.id}
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
              >
                <ProductCard diamond={d} />
              </div>
            ))
        }
      </div>

      {/* Pagination */}
      {!loading && meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <PaginationBtn
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!meta.hasPrevPage}
            label="← Prev"
          />
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 text-sm font-sans rounded-md transition-all duration-200 ${
                p === currentPage
                  ? "bg-champagne text-obsidian-900 font-medium"
                  : "text-obsidian-300 hover:text-white border border-elevated hover:border-champagne/40"
              }`}
            >
              {p}
            </button>
          ))}
          <PaginationBtn
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!meta.hasNextPage}
            label="Next →"
          />
        </div>
      )}
    </div>
  );
}

function PaginationBtn({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 h-9 text-sm font-sans text-obsidian-300 hover:text-white border border-elevated hover:border-champagne/40 rounded-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-elevated disabled:hover:text-obsidian-300"
    >
      {label}
    </button>
  );
}
