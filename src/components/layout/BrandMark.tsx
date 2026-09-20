import { Link } from "react-router";
import { cn } from "@/lib/utils";

/**
 * ConsoleSeal — circular archive seal with a stylized "M" forged from
 * archive columns, an inner sigil, and an amethyst ring. No anime characters.
 */
export function ConsoleSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="seal-amethyst" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DCCBFB" />
          <stop offset="0.55" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C5CCF" />
        </linearGradient>
        <radialGradient id="seal-ember" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#B31B34" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8B1126" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ember core */}
      <circle cx="32" cy="32" r="26" fill="url(#seal-ember)" />

      {/* Outer seal ring */}
      <circle cx="32" cy="32" r="29" fill="none" stroke="url(#seal-amethyst)" strokeWidth="2" />
      <circle
        cx="32"
        cy="32"
        r="24.5"
        fill="none"
        stroke="url(#seal-amethyst)"
        strokeWidth="1"
        strokeDasharray="2.5 4"
        opacity="0.8"
      />

      {/* Stylized M: two archive columns + apex */}
      <path
        d="M18 44 V22 L24 30 L32 20 L40 30 L46 22 V44"
        fill="none"
        stroke="url(#seal-amethyst)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Archive column plinths */}
      <path d="M15 44 h34" stroke="url(#seal-amethyst)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M17.5 47.5 h29" stroke="#B31B34" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/* * Brand lockup: seal + MANHWA CONSOLE wordmark with amethyst styling. */
export function BrandMark({ to = "/", compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Manhwa Console home"
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-amethyst/30 bg-void shadow-[0_0_18px_-4px_var(--crimson-glow)] transition-transform duration-300 group-hover:rotate-6">
        <ConsoleSeal className="size-6" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="font-display block truncate text-[15px] font-bold leading-tight tracking-[0.18em] text-parchment">
            MANHWA
          </span>
          <span className="text-gradient-amethyst font-display block text-[11px] font-semibold leading-tight tracking-[0.42em]">
            CONSOLE
          </span>
        </span>
      )}
    </Link>
  );
}
