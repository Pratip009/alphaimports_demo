import React from "react";

export default function Header() {
  return (
    <header className="border-b border-elevated sticky top-0 z-50 bg-obsidian-900/80 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <DiamondLogo />
          <div>
            <p className="font-display text-white text-lg tracking-[0.15em] leading-none">
              Alpha Imports
            </p>
            <p className="font-sans text-[9px] text-champagne tracking-[0.3em] uppercase mt-0.5">
              Fine Diamonds
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Collection", "About", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs font-sans tracking-widest uppercase text-obsidian-300 hover:text-champagne transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-obsidian-300 hover:text-white transition-colors">
            <SearchIcon />
          </button>
          <button className="text-obsidian-300 hover:text-white transition-colors">
            <BagIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function DiamondLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L22 9L12 22L2 9L12 2Z"
        stroke="#c9a96e"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M2 9H22M12 2L7 9L12 22L17 9L12 2Z"
        stroke="#c9a96e"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
