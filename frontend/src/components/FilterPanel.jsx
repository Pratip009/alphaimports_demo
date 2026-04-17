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
    <p className="text-[9px] font-sans font-medium tracking-[0.18em] uppercase text-champagne opacity-75 mb-2.5">
      {children}
    </p>
  );
}

function Section({ children }) {
  return (
    <div className="py-3.5 border-b border-[#1c1c22] last:border-0 last:pb-0 first:pt-0">
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
        className="w-full bg-[#18181c] border border-[#2a2a32] rounded-[7px] px-2.5 py-[7px] text-[12px] text-[#c8c8cc] placeholder-[#38383f] focus:outline-none focus:border-champagne/30 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="text-[10px] text-[#38383f] flex-shrink-0">—</span>
      <input
        type="number"
        placeholder={placeholders[1]}
        value={filters[maxKey]}
        onChange={(e) => setFilter(maxKey, e.target.value)}
        className="w-full bg-[#18181c] border border-[#2a2a32] rounded-[7px] px-2.5 py-[7px] text-[12px] text-[#c8c8cc] placeholder-[#38383f] focus:outline-none focus:border-champagne/30 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
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
          ? "text-[#e05c5c] border-[#e05c5c] bg-[#e05c5c]/[0.07]"
          : "text-champagne border-champagne bg-champagne/[0.07]";
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`text-[10px] font-sans font-normal tracking-[0.06em] border rounded-[5px] px-[9px] py-1 leading-none transition-all duration-150 ${
              isActive
                ? activeClass
                : "text-[#666670] border-[#252530] hover:text-[#c8c8cc] hover:border-[#3a3a42]"
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
      <div className="bg-[#111114] border border-[#222228] rounded-2xl px-5 py-5 sticky top-24 flex flex-col gap-0">

        {/* ── Header ── */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1c1c22]">
          <h2 className="font-serif text-[18px] font-normal text-[#e8e8ea] tracking-[0.04em]">
            Refine
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[10px] font-sans tracking-[0.1em] uppercase text-champagne opacity-70 hover:opacity-100 transition-opacity"
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
                  ? "text-[#e05c5c] border-[#e05c5c] bg-[#e05c5c]/[0.07]"
                  : "text-champagne border-champagne bg-champagne/[0.07]";
              return (
                <button
                  key={s}
                  onClick={() => setFilter("stone", s)}
                  className={`flex-1 text-[10px] font-sans tracking-[0.08em] border rounded-[5px] py-1.5 leading-none transition-all duration-150 ${
                    isActive
                      ? activeClass
                      : "text-[#666670] border-[#252530] hover:text-[#c8c8cc] hover:border-[#3a3a42]"
                  }`}
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
              className="w-full appearance-none bg-[#18181c] border border-[#2a2a32] rounded-[7px] px-2.5 py-2 text-[12px] text-[#c8c8cc] focus:outline-none focus:border-champagne/30 transition-colors cursor-pointer pr-7"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="10" height="6" viewBox="0 0 10 6" fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="#555560" strokeWidth="1.2" strokeLinecap="round" />
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

        {/* ── Color — swaps based on stone ── */}
        <Section>
          <SecLabel>Color Grade</SecLabel>
          <Pills
            items={activeColors}
            activeItems={filters.color}
            ruby={isRuby}
            onToggle={(c) => toggleMultiSelect("color", c)}
          />
          <p className="text-[9px] text-[#3e3e48] mt-1.5 tracking-[0.04em]">
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
          <p className="text-[9px] text-[#3e3e48] mt-1.5 tracking-[0.04em]">
            IF — Internally Flawless &nbsp;·&nbsp; VS2 — Very Slight
          </p>
        </Section>

      </div>
    </aside>
  );
}