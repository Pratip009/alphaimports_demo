import React from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const STONES    = ["Diamond", "Ruby"];
const SHAPES    = ["Round", "Oval", "Princess", "Cushion"];
const CLARITIES = ["IF", "VVS1", "VVS2", "VS1", "VS2"];

const DIAMOND_COLORS = ["D", "E", "F", "G", "H"];
const RUBY_COLORS    = ["Vivid Red", "Pigeon Blood", "Deep Red"];

const SORT_OPTIONS = [
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "carat_asc",  label: "Carat: Low → High" },
  { value: "carat_desc", label: "Carat: High → Low" },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function SecLabel({ children }) {
  return (
    <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase mb-2.5"
       style={{ color: "#c9a96e" }}>
      {children}
    </p>
  );
}

function Section({ children }) {
  return (
    <div className="py-3.5 border-b border-[#2a2a34] last:border-0 last:pb-0 first:pt-0">
      {children}
    </div>
  );
}

function RangeRow({ minKey, maxKey, placeholders, filters, setFilter }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder={placeholders[0]}
        value={filters[minKey]}
        onChange={(e) => setFilter(minKey, e.target.value)}
        className="w-full bg-[#0e0e12] border border-[#36363f] rounded-[7px] px-2.5 py-[7px] text-[12px] text-[#e8e8ea] placeholder-[#4a4a54] focus:outline-none focus:border-[#c9a96e]/50 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="text-[11px] flex-shrink-0" style={{ color: "#4a4a54" }}>—</span>
      <input
        type="number"
        placeholder={placeholders[1]}
        value={filters[maxKey]}
        onChange={(e) => setFilter(maxKey, e.target.value)}
        className="w-full bg-[#0e0e12] border border-[#36363f] rounded-[7px] px-2.5 py-[7px] text-[12px] text-[#e8e8ea] placeholder-[#4a4a54] focus:outline-none focus:border-[#c9a96e]/50 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}

function Pills({ items, activeItems, onToggle, single = false, ruby = false }) {
  return (
    <div className="flex flex-wrap gap-[5px]">
      {items.map((item) => {
        const isActive = single ? activeItems === item : activeItems.includes(item);
        const activeClass = ruby
          ? "text-[#f07070] border-[#e05c5c] bg-[#e05c5c]/[0.10]"
          : "text-[#e2b97a] border-[#c9a96e] bg-[#c9a96e]/[0.10]";
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`text-[10px] font-sans font-medium tracking-[0.06em] border rounded-[5px] px-[9px] py-1 leading-none transition-all duration-150 ${
              isActive
                ? activeClass
                : "text-[#909098] border-[#2e2e38] hover:text-[#d8d8dc] hover:border-[#4a4a54]"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function FilterPanel({
  filters,
  setFilter,
  toggleMultiSelect,
  resetFilters,
  activeFilterCount,
}) {
  const isRuby       = filters.stone === "Ruby";
  const activeColors = isRuby ? RUBY_COLORS : DIAMOND_COLORS;

  return (
    <aside className="w-full lg:w-60 xl:w-[240px] flex-shrink-0">
      <div
        className="rounded-2xl px-5 py-5 sticky top-24 flex flex-col gap-0"
        style={{
          background: "#111114",
          border: "1px solid #2e2e38",
          boxShadow: "0 2px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)",
        }}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#2a2a34]">
          <h2 className="font-serif text-[18px] font-normal tracking-[0.04em]"
              style={{ color: "#f0f0f2" }}>
            Refine
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[10px] font-sans font-medium tracking-[0.1em] uppercase transition-opacity hover:opacity-100"
              style={{ color: "#c9a96e", opacity: 0.9 }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* ── Stone toggle ── */}
        <Section>
          <SecLabel>Stone</SecLabel>
          <div className="flex gap-[5px]">
            {STONES.map((s) => {
              const isActive = filters.stone === s;
              const activeClass =
                s === "Ruby"
                  ? { color: "#f07070", border: "1px solid #e05c5c", background: "rgba(224,92,92,0.10)" }
                  : { color: "#e2b97a", border: "1px solid #c9a96e", background: "rgba(201,169,110,0.10)" };
              const inactiveStyle = { color: "#909098", border: "1px solid #2e2e38" };
              return (
                <button
                  key={s}
                  onClick={() => setFilter("stone", s)}
                  className="flex-1 text-[10px] font-sans font-medium tracking-[0.08em] rounded-[5px] py-1.5 leading-none transition-all duration-150"
                  style={isActive ? activeClass : inactiveStyle}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "#d8d8dc"; e.currentTarget.style.borderColor = "#4a4a54"; }}}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "#909098"; e.currentTarget.style.borderColor = "#2e2e38"; }}}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Sort ── */}
        <Section>
          <SecLabel>Sort By</SecLabel>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilter("sortBy", e.target.value)}
              className="w-full appearance-none bg-[#0e0e12] border border-[#36363f] rounded-[7px] px-2.5 py-2 text-[12px] text-[#e8e8ea] focus:outline-none focus:border-[#c9a96e]/50 transition-colors cursor-pointer pr-7"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#111114", color: "#e8e8ea" }}>
                  {o.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="10" height="6" viewBox="0 0 10 6" fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </Section>

        {/* ── Shape ── */}
        <Section>
          <SecLabel>Shape</SecLabel>
          <Pills
            items={SHAPES}
            activeItems={filters.shape}
            single
            ruby={isRuby}
            onToggle={(s) => setFilter("shape", filters.shape === s ? "" : s)}
          />
        </Section>

        {/* ── Carat ── */}
        <Section>
          <SecLabel>Carat Weight</SecLabel>
          <RangeRow
            minKey="minCarat"
            maxKey="maxCarat"
            placeholders={["0.50", "10.0"]}
            filters={filters}
            setFilter={setFilter}
          />
        </Section>

        {/* ── MM Size ── */}
        <Section>
          <SecLabel>MM Size</SecLabel>
          <RangeRow
            minKey="minMM"
            maxKey="maxMM"
            placeholders={["4.5", "14.0"]}
            filters={filters}
            setFilter={setFilter}
          />
        </Section>

        {/* ── Price ── */}
        <Section>
          <SecLabel>Price (USD)</SecLabel>
          <RangeRow
            minKey="minPrice"
            maxKey="maxPrice"
            placeholders={["$1,800", "$38,000"]}
            filters={filters}
            setFilter={setFilter}
          />
        </Section>

        {/* ── Color ── */}
        <Section>
          <SecLabel>Color Grade</SecLabel>
          <Pills
            items={activeColors}
            activeItems={filters.color}
            ruby={isRuby}
            onToggle={(c) => toggleMultiSelect("color", c)}
          />
          <p className="text-[9px] mt-1.5 tracking-[0.04em]" style={{ color: "#585864" }}>
            {isRuby
              ? "Vivid Red — most prized · Deep Red — rich tone"
              : "D — Colorless \u00a0·\u00a0 H — Near Colorless"}
          </p>
        </Section>

        {/* ── Clarity ── */}
        <Section>
          <SecLabel>Clarity</SecLabel>
          <Pills
            items={CLARITIES}
            activeItems={filters.clarity}
            ruby={isRuby}
            onToggle={(c) => toggleMultiSelect("clarity", c)}
          />
          <p className="text-[9px] mt-1.5 tracking-[0.04em]" style={{ color: "#585864" }}>
            IF — Internally Flawless &nbsp;·&nbsp; VS2 — Very Slight
          </p>
        </Section>

      </div>
    </aside>
  );
}