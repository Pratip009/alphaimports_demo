import React from "react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

function EmptyState({ onReset }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-6 opacity-20">
        <path d="M32 4L60 22L32 60L4 22L32 4Z" stroke="#c9a96e" strokeWidth="1.5" fill="none" />
        <path d="M4 22H60M32 4L18 22L32 60L46 22L32 4Z" stroke="#c9a96e" strokeWidth="1" fill="none" />
      </svg>
      <p className="font-serif text-2xl text-white mb-2">No diamonds found</p>
      <p className="text-sm text-[#666670] font-sans mb-6 max-w-xs">
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

function ErrorState({ error }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-5 opacity-30">
        <circle cx="24" cy="24" r="20" stroke="#c9a96e" strokeWidth="1.2" fill="none" />
        <path d="M24 14v12M24 32v2" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="font-serif text-xl text-white mb-2">Connection Error</p>
      <p className="text-sm text-[#666670] font-sans">{error}</p>
    </div>
  );
}

export default function ProductGrid({
  diamonds,
  loading,
  error,
  meta,
  onReset,
  onPageChange,
  currentPage,
}) {
  if (error) return (
    <div className="flex-1 min-w-0">
      <ErrorState error={error} />
    </div>
  );

  return (
    <div className="flex-1 min-w-0">

      {/* ── Results bar ── */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#666670] font-sans">
          {loading ? (
            <span
              className="inline-block h-4 w-32 rounded"
              style={{
                background: "linear-gradient(90deg, #1a1a1e 25%, #242428 50%, #1a1a1e 75%)",
                backgroundSize: "800px 100%",
                animation: "shimmer 1.8s infinite",
              }}
            />
          ) : (
            <>
              <span className="text-white font-medium">{meta?.total ?? 0}</span> stones found
              {meta?.total > 0 && (
                <span className="ml-1 text-[#555560]">
                  — page {meta.page} of {meta.totalPages}
                </span>
              )}
            </>
          )}
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? [...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)
          : diamonds.length === 0
          ? <EmptyState onReset={onReset} />
          : diamonds.map((d, i) => (
              <div
                key={d.id}
                style={{
                  animation: "fadeUp 0.35s ease both",
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <ProductCard diamond={d} />
              </div>
            ))
        }
      </div>

      {/* ── Pagination ── */}
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
                  ? "bg-champagne text-[#0d0d0f] font-medium"
                  : "text-[#909098] hover:text-white border border-[#2e2e38] hover:border-champagne/40"
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

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -800px 0; }
          100% { background-position:  800px 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}

function PaginationBtn({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 h-9 text-sm font-sans text-[#909098] hover:text-white border border-[#2e2e38] hover:border-champagne/40 rounded-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2e2e38] disabled:hover:text-[#909098]"
    >
      {label}
    </button>
  );
}