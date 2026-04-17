import React, { useState } from "react";

const CLARITY_RANK = { IF: 5, VVS1: 4, VVS2: 3, VS1: 2, VS2: 1 };

function Badge({ children, variant = "default" }) {
  const base = "inline-block text-[9px] font-sans font-medium tracking-[0.14em] uppercase px-1.5 py-0.5 rounded-sm leading-none";
  const variants = {
    default: "bg-obsidian-700 text-obsidian-300",
    gold:    "bg-champagne/10 text-champagne border border-champagne/20",
    premium: "bg-champagne text-obsidian-900",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}

export default function ProductCard({ diamond }) {
  const [imgError, setImgError] = useState(false);
  const isPremium = CLARITY_RANK[diamond.clarity] >= 4 && ["D", "E"].includes(diamond.color);

  return (
    <article className="bg-[#111114] border border-[#2a2a30] rounded-[14px] overflow-hidden group hover:border-champagne/30 transition-all duration-300 hover:-translate-y-0.5">

      {/* Image — fixed height, tighter than before */}
      <div className="relative h-40 overflow-hidden bg-[#1a1a1e]">
        {!imgError ? (
          <img
            src={diamond.image}
            alt={diamond.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <DiamondIcon />
          </div>
        )}

        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111114cc] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {isPremium && (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="premium">Exceptional</Badge>
          </div>
        )}
        <div className="absolute top-2.5 right-2.5">
          <Badge variant="gold">{diamond.shape}</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 pt-3 pb-3.5 space-y-2.5">

        {/* Name + ID */}
        <div>
          <h3 className="font-serif text-[15px] font-normal text-white leading-snug group-hover:text-champagne transition-colors truncate">
            {diamond.name}
          </h3>
          <p className="text-[10px] text-[#555560] font-sans mt-0.5">#{diamond.id}</p>
        </div>

        {/* Specs 2×2 grid */}
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5">
          <Spec label="Carat"   value={`${diamond.carat}ct`} />
          <Spec label="Size"    value={`${diamond.mm}mm`} />
          <Spec label="Color"   value={diamond.color}    gold />
          <Spec label="Clarity" value={diamond.clarity}  gold={CLARITY_RANK[diamond.clarity] >= 4} />
        </div>

        {/* Divider */}
        <div className="h-px mx-[-14px]" style={{ background: "linear-gradient(90deg, transparent, #2e2e38, transparent)" }} />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <p className="font-serif text-[19px] font-normal text-champagne tracking-[0.01em]">
            ${diamond.price.toLocaleString()}
          </p>
          <button className="text-[10px] font-sans font-medium tracking-[0.06em] text-[#888890] border border-[#2e2e38] hover:text-white hover:border-champagne/30 px-2.5 py-[5px] rounded-[5px] transition-all duration-200">
            View
          </button>
        </div>

      </div>
    </article>
  );
}

function Spec({ label, value, gold }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.12em] text-[#555560] font-sans leading-none mb-0.5">{label}</p>
      <p className={`text-[12px] font-sans font-medium leading-none ${gold ? "text-champagne" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function DiamondIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L44 18L24 44L4 18Z" stroke="#c9a96e" strokeWidth="1.2" fill="none" opacity="0.35"/>
      <path d="M4 18H44M24 4L14 18L24 44L34 18L24 4Z" stroke="#c9a96e" strokeWidth="0.8" fill="none" opacity="0.2"/>
    </svg>
  );
}